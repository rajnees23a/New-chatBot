import {
  Component,
  NgZone,
  ElementRef,
  Renderer2,
  ViewChild,
  OnDestroy,
  AfterViewChecked,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { Subscription } from 'rxjs';
import { Tooltip } from 'bootstrap';
import { MockDataService, FormField, MockResponseStage, MOCK_TEXT } from '../mock-data';
import { HistoryComponentMockData } from './history.mock';
declare let $: any;

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',

})
export class HistoryComponent
  implements OnDestroy, AfterViewChecked, AfterViewInit {
  private mockEnabled = true; // <-- Toggle this to switch between mock and real data

  private conversationStage = 0;

  private mockResponseStages: MockResponseStage[] = MockDataService.getChatbotConversationStages();

  public dataSubscription!: Subscription;
  fileExtension: string = '';
  addfileExtension: string = '';

  constructor(
    public api: ServiceService,
    public ngZone: NgZone,
  ) {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        this.ngZone.run(() => {
          const result = event.results[0][0].transcript;
          this.userInput = result;
        });
      };

      this.recognition.onerror = (event: any) => {
        this.ngZone.run(() => {
          this.isListening = false;
        });
      };

      this.recognition.onend = () => {
        this.ngZone.run(() => {
          this.isListening = false;
        });
      };
    }
  }

  fields: any[] = [];
  draftData: any;
  fileIcon: any;
  chatHistory: any[] = [];
  userInput: string = '';
  loader: boolean = false;
  isListening: boolean = false;
  recognition: any;
  selectedFile: File | null = null;
  uploadFileName: string = '';
  fileUrlForChatUpload: string = '';
  fileUploadFromChatBot: File | null = null;
  uploadFileFirstTime: boolean = false;
  dataa: any = {
    session_id: '',
    user_name: '',
    user_message: '',
    edit_field: '',
    confirmation: 'False'
  };
  sessionId: string = '';
  userName: string = '';
  staticBotMsg: boolean = false;
  editButtonClicked: boolean = false;
  editFieldVal: string = '';
  ADAtext: string = MOCK_TEXT.ADA_PLACEHOLDER;
  isEmbeddedContext: boolean = false;
  bicFieldData: any = {};

  // UI state properties
  selectedAreas: boolean[] = [];
  selectedDestination: boolean[] = [];
  @ViewChild('autoResizeTextarea') textarea!: ElementRef<HTMLTextAreaElement>;
  placeholder = MOCK_TEXT.REPLY_PLACEHOLDER;
  bussinessMappingButtonClicke = false;
  bussinessUserInputForMappingButtons = '';
  itMappingButtonClicke = false;
  itUserInputForMappingButtons = '';
  bussinessDropDownKey = '';
  itDropDownKey = '';

  // Index mapping based on design for progress % (excluding Additional attachments field)
  groupA = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 9 fields × 6% = 54%
  groupB = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]; // 10 fields × 3% = 30%
  groupC = [19, 20, 21, 22, 24]; // 5 fields × 3.2% = 16% (excluding index 23: Additional attachments)
  progressPercentage = 0;
  confirmBtnOfAreaClk = false;
  confirmBtnOfDestClk = false;
  confirmBtnOfBussClk = false;
  selectedBussiness: boolean[] = [];

  ngOnInit() {
    this.isEmbeddedContext = this.checkIfEmbedded();
    this.detectMobile();

    console.log('History Component - isMobile:', this.isMobile);
    console.log('History Component - isEmbeddedContext:', this.isEmbeddedContext);
    console.log('History Component - window.innerWidth:', window.innerWidth);

    this.dataSubscription = this.api.currentData$.subscribe((data) => {
      if (data) {
        if (data.comingFrom == 'draft') {
          this.draftData = data;
          this.chatHistory = this.draftData['sessionDataDraft'].chatHistory;
          this.fields = this.draftData['sessionDataDraft'].formFieldValue;
          this.sessionId = this.draftData['sessionDataId'];
          this.userName = this.draftData['sessionDataUserName'];
          this.dataa.session_id = this.draftData['sessionDataId'];
          this.dataa.user_name = this.draftData['sessionDataUserName'];

          // Initialize bicFieldData from form fields for mock continuation
          this.initializeBicFieldData();
          this.determineConversationStage();
          this.validateFieldStates();
          this.filesSetForHistory();
          this.calculateProgress();
          this.checkFirst10Completed();
          // Hide loader after processing draft data
          this.api.hide();
        } else if (data.comingFrom == 'request') {
          this.chatHistory = data.chatData.chatHistory;
          this.fields = data.chatData.formFieldValue;
          this.sessionId = data.session_id;
          this.userName = data.user_name;
          this.dataa.session_id = data.session_id;
          this.dataa.user_name = data.user_name;

          this.initializeBicFieldData();
          this.determineConversationStage();
          this.validateFieldStates();
          this.filesSetForHistory();
          this.calculateProgress();
          this.checkFirst10Completed();
          this.api.hide();
        }
      }
    });

    this.selectedAreas = new Array(6).fill(false);
    this.selectedDestination = new Array(4).fill(false);
    this.selectedBussiness = new Array(4).fill(false);
    
    // Add beforeunload event listener to auto-save when user navigates away
    window.addEventListener('beforeunload', () => {
      this.autoSaveDraft();
    });
    
    // Set up periodic auto-save every 30 seconds if there's conversation activity
    this.autoSaveInterval = setInterval(() => {
      if (this.chatHistory && this.chatHistory.length > 0) {
        this.autoSaveDraft();
      }
    }, 30000); // 30 seconds
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeTooltips();
    }, 100);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    // Auto-save draft when navigating away from history component
    this.autoSaveDraft();
    
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    
    // Clean up resize listener
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    
    // Clean up beforeunload listener
    window.removeEventListener('beforeunload', this.autoSaveDraft);
    
    // Clean up auto-save interval
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
  }

  // Check if component is embedded within another page context
  checkIfEmbedded(): boolean {
    try {
      const container = document.querySelector('.request-detail-container');
      return container !== null;
    } catch (error) {
      return false;
    }
  }

  setFileIcon(localfileExtension: string) {
    if (localfileExtension === '.doc' || localfileExtension === '.docx') {
      this.fileIcon = 'assets/images/docs.png';
    } else if (localfileExtension === '.ppt' || localfileExtension === '.pptx') {
      this.fileIcon = 'assets/images/ppt1.png';
    } else if (localfileExtension === '.pdf') {
      this.fileIcon = 'assets/images/download.png';
    } else if (localfileExtension === '.xls' || localfileExtension === '.xlsx') {
      this.fileIcon = 'assets/images/xl.png';
    } else {
      this.fileIcon = 'assets/images/download(1)2.png';
    }
  }

  autoResize(): void {
    const textArea = this.textarea.nativeElement;
    textArea.style.height = 'auto'; // Reset height
    textArea.style.height = `${textArea.scrollHeight}px`; // Set height based on content
  }

  stopListening(): void {
    this.isListening = false;
    if (this.recognition && typeof this.recognition.stop === 'function') {
      this.recognition.stop();
    }
  }

  handleUserInput(data: any) {
    if (this.selectedFile) {
      this.uploadFileName = this.selectedFile.name;
      this.fileUploadFromChatBot = this.selectedFile;
      this.chatHistory.push({
        isFile: true,
        fileName: this.selectedFile.name,
        fileUrl: this.fileUrlForChatUpload,
        sender: 'user',
      });
      this.uploadFileFirstTime = true;
    }
    if (this.userInput) {
      this.chatHistory.push({
        text: this.userInput,
        sender: 'user',
        isFile: false,
      });
    }
    if (this.dataa.edit_field !== '' && !this.editButtonClicked) {
      this.dataa.user_message = data;
      this.dataa.edit_field = this.editFieldVal;
      this.dataa.confirmation = 'True';
      this.staticBotMsg = true;
    }
    this.loader = true;
    this.responseDataMethod(data);
    this.userInput = '';
    this.editButtonClicked = false;
    this.selectedFile = null;
    this.resetTextAreaSize();
    
    // Auto-save after user input to preserve conversation progress
    setTimeout(() => {
      this.autoSaveDraft();
    }, 100);
  }

  // Initialize bicFieldData from current field values
  initializeBicFieldData() {
    this.bicFieldData = {};
    this.fields.forEach(field => {
      if (field.value && field.value.trim() !== '' && field.value !== this.ADAtext) {
        this.bicFieldData[field.label] = field.value;
      }
    });
  }

  // Determine current conversation stage based on filled fields
  determineConversationStage() {
    // Use centralized utility method from mock data
    const stageFromFields = HistoryComponentMockData.determineConversationStage(this.fields, this.ADAtext);

    // Set conversation stage with bounds checking
    this.conversationStage = Math.min(stageFromFields, this.mockResponseStages.length - 1);

    // Ensure we don't exceed the available stages
    if (this.conversationStage >= this.mockResponseStages.length) {
      this.conversationStage = this.mockResponseStages.length - 1;
    }
  }

  simulateMockApiResponse(userMessage: string) {
    if (this.conversationStage < this.mockResponseStages.length) {
      const currentStage = this.mockResponseStages[this.conversationStage];

      Object.keys(currentStage.formUpdates).forEach(fieldLabel => {
        const field = this.fields.find(f => f.label === fieldLabel);
        if (field) {
          field.value = currentStage.formUpdates[fieldLabel];
          field.valid = true;
          // Update bicFieldData to keep it in sync
          this.bicFieldData[fieldLabel] = currentStage.formUpdates[fieldLabel];
        }
      });

      // Add bot response to chat
      this.chatHistory.push({
        text: currentStage.botMessage,
        sender: 'bot',
        isFile: false,
        staticBotMessage: true
      });

      // Use centralized text constants for interaction responses
      const botMessages = HistoryComponentMockData.getBotMessages();

      if (currentStage.dropdown && currentStage.fieldName) {
        this.chatHistory.push({
          text: `${botMessages.DROPDOWN_PREFIX}${currentStage.dropdown.join(', ')}`,
          sender: 'bot',
          isFile: false,
          staticBotMessage: true
        });
      }

      if (currentStage.buttons && currentStage.fieldName) {
        this.chatHistory.push({
          text: `${botMessages.BUTTON_OPTIONS_PREFIX}${currentStage.buttons.join(', ')}`,
          sender: 'bot',
          isFile: false,
          staticBotMessage: true
        });
      }

      if (currentStage.mappingButton && currentStage.fieldName) {
        this.chatHistory.push({
          text: `${botMessages.MAPPING_BUTTON_PREFIX}${currentStage.mappingButton.join(', ')}`,
          sender: 'bot',
          isFile: false,
          staticBotMessage: true
        });
      }

      // Move to next stage
      this.conversationStage++;

      // Calculate and update progress and submit button state
      this.calculateProgress();
      this.checkFirst10Completed();

      // Update session storage with new data
      this.updateSessionStorage();

    } else {
      // Conversation complete - use centralized message
      const botMessages = HistoryComponentMockData.getBotMessages();
      this.chatHistory.push({
        text: botMessages.CONVERSATION_COMPLETE,
        sender: 'bot',
        isFile: false,
        staticBotMessage: true
      });
    }
  }

  responseDataMethod(data: any) {
    if (this.mockEnabled) {
      // Use mock response system for demo
      setTimeout(() => {
        this.simulateMockApiResponse(data);
        this.loader = false;
      }, 1500);
    } else {
      this.api.postData(this.dataa).subscribe((responseData: any) => {
        this.loader = false;
      });
    }
  }

  // Calculate progress percentage based on completed fields
  calculateProgress() {
    let completedFields = 0;
    let totalFields = this.fields.length;

    totalFields = totalFields - 1;

    this.fields.forEach((field, index) => {
      if (index !== 23 && field.completed && field.value && field.value.trim() !== '' && field.value !== this.ADAtext) {
        completedFields++;
      }
    });

    let progressPercentage = 0;

    this.fields.forEach((field, index) => {
      if (field.value && field.value.trim() !== '' && field.value !== this.ADAtext) {
        if (this.groupA.includes(index)) {
          progressPercentage += 6; // Group A: 6% each
        } else if (this.groupB.includes(index)) {
          progressPercentage += 3; // Group B: 3% each
        } else if (this.groupC.includes(index)) {
          progressPercentage += 3.2; // Group C: 3.2% each
        }
      }
    });

    this.progressPercentage = Math.round(progressPercentage);

    if (this.progressPercentage > 100) {
      this.progressPercentage = 100;
    }
  }

  // Check if first 9 fields are completed to enable/disable submit button
  checkFirst10Completed() {
    const first9Fields = this.fields.slice(0, 9); // Get first 9 elements (indices 0-8)
    let allCompleted = true;
    for (const field of first9Fields) {
      if (!field.value || field.value.trim() === '' || field.value === this.ADAtext) {
        allCompleted = false;
        break;
      }
    }
    if (allCompleted) {
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
    }
  }

  // Validate field states without auto-completing them (preserve user's explicit completion actions)
  validateFieldStates() {
    this.fields.forEach(field => {
      if (field.value && field.value.trim() !== '' && field.value !== this.ADAtext) {
        field.valid = true;
      } else {
        field.completed = false;
        field.valid = false;
      }
    });
  }

  // Update session storage with current form state
  updateSessionStorage() {
    try {
      // Update the main chat_drafts array that left-nav component reads from
      if (this.mockEnabled && this.sessionId) {
        const draftData = {
          session_id: this.sessionId,
          user_name: this.userName || 'demo_user',
          timestamp: new Date().toISOString(),
          chatHistory: this.chatHistory,
          formFieldValue: this.fields.map(field => ({
            label: field.label,
            value: this.bicFieldData[field.label] || field.value || '',
            valid: field.valid,
            editing: field.editing,
            image: field.image,
            completed: field.completed
          })),
          submit: false
        };

        // Get existing drafts from session storage
        const existingDrafts = this.getDraftsFromSessionStorage();
        
        // Find and update existing draft
        const existingIndex = existingDrafts.findIndex(draft => draft.session_id === this.sessionId);
        
        if (existingIndex > -1) {
          // Update existing draft
          existingDrafts[existingIndex] = draftData;
        } else {
          // Add new draft (this shouldn't normally happen in history component)
          existingDrafts.unshift(draftData);
        }

        // Save to session storage
        sessionStorage.setItem('chat_drafts', JSON.stringify(existingDrafts));
        
        console.log('History Component: Draft updated in session storage for session:', this.sessionId);
      }
    } catch (error) {
      console.warn('Error updating session storage:', error);
    }
  }


  // File handling methods
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadFileName = file.name;
      const extension = file.name.substring(file.name.lastIndexOf('.'));
      this.setFileIcon(extension);
    }
  }

  onFileAttach(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadFileName = file.name;
      const extension = file.name.substring(file.name.lastIndexOf('.'));
      this.setFileIcon(extension);
    }
  }

  // Voice recognition methods
  startListening() {
    if (this.recognition) {
      this.isListening = true;
      this.recognition.start();
    }
  }

  // UI state properties
  isMobile = window.innerWidth < 768;
  isActive = false;
  allFieldssLookGoodButton = true;
  buttonDisabled = true; // Initialize as disabled, will be enabled when first 9 fields are completed
  errorDivVisible = false;
  errorDivText = '';
  successDivVisible = false;
  successDivText = '';
  showChatDelete = false;
  showAttachmentDelete = false;
  
  // Store resize listener for cleanup
  private resizeListener?: () => void;
  private autoSaveInterval?: any;
  fileUploadFromAttachment: File | null = null;
  fileUploadFromAttachmentName = '';

  // Button methods
  toggleButton() {
    this.isActive = !this.isActive;
  }

  AllGoodButton() {
    this.allFieldssLookGoodButton = false;
    this.fields.forEach((field) => {
      if (
        field.value !== '' &&
        field.value !== this.ADAtext
      ) {
        field.completed = true;
      }
    });
    this.calculateProgress();
    this.checkFirst10Completed();
  }

  checkButton(index: number) {
    if (this.fields[index]) {
      this.fields[index].editing = false;
      this.fields[index].valid = true;
      this.fields[index].completed = true;
    }
    this.calculateProgress();
    this.checkFirst10Completed();
  }

  editButton(index: number) {
    if (this.fields[index]) {
      this.fields[index].editing = true;
    }
  }

  addButton(index: number) {
    if (this.fields[index]) {
      this.fields[index].editing = true;
    }
  }

  submitButton() {
    if (!this.buttonDisabled) {
      // Submit logic here
      this.successDivVisible = true;
      this.successDivText = HistoryComponentMockData.getBotMessages().FORM_SUBMITTED_SUCCESS;
      setTimeout(() => {
        this.successDivVisible = false;
      }, 3000);
    }
  }

  submitButtonPopup() {
    this.submitButton();
  }

  // File management methods
  showChatDeleteMethod() {
    this.showChatDelete = !this.showChatDelete;
  }

  showAttachmentDeleteMethod() {
    this.showAttachmentDelete = !this.showAttachmentDelete;
  }

  downloadFileFromChat() {
    console.log('Downloading file from chat');
  }

  downloadFileFromAdditional() {
    console.log('Downloading additional file');
  }

  deleteAttachment() {
    this.fileUploadFromAttachment = null;
    this.fileUploadFromAttachmentName = '';
    this.showAttachmentDelete = false;
  }

  // Error handling methods
  errorDivCloseInstant() {
    this.errorDivVisible = false;
    this.errorDivText = '';
  }

  successDivCloseInstant() {
    this.successDivVisible = false;
    this.successDivText = '';
  }

  selectedIndexOfButton = -1;

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  // Button interaction methods
  timeLiButton(value: any, index?: any) {
    this.chatHistory.push({
      text: value,
      sender: 'user',
      isFile: false
    });
    this.loader = true;
    this.responseDataMethod(value);
    this.selectedIndexOfButton = index;
  }

  yesNoButton(value: any) {
    this.chatHistory.push({
      text: value,
      sender: 'user',
      isFile: false
    });
    this.loader = true;
    this.responseDataMethod(value);
  }

  businessMappingButtonClicked(value: any) {
    this.bussinessMappingButtonClicke = true;
    this.bussinessUserInputForMappingButtons = value;
    this.chatHistory.push({
      text: value,
      sender: 'user',
      isFile: false
    });
    this.loader = true;
    this.responseDataMethod(value);
  }

  businessConfirmButton() {
    if (this.bussinessUserInputForMappingButtons) {
      this.responseDataMethod(this.bussinessUserInputForMappingButtons);
    }
  }

  itMappingButtonClicked(value: any) {
    this.itMappingButtonClicke = true;
    this.itUserInputForMappingButtons = value;
    this.chatHistory.push({
      text: value,
      sender: 'user',
      isFile: false
    });
    this.loader = true;
    this.responseDataMethod(value);
  }

  itConfirmButton() {
    if (this.itUserInputForMappingButtons) {
      this.responseDataMethod(this.itUserInputForMappingButtons);
    }
  }

  // Area and destination confirmation methods
  onConfirmAreas() {
    this.confirmBtnOfAreaClk = true;
    const areasOptions = HistoryComponentMockData.getFieldOptions().AREAS_INVOLVED;
    const selectedAreas = this.selectedAreas
      .map((selected, index) => selected ? areasOptions[index] : null)
      .filter(area => area !== null);

    if (selectedAreas.length > 0) {
      this.responseDataMethod(selectedAreas.join(', '));
      // Auto-save after user selection
      setTimeout(() => this.autoSaveDraft(), 100);
    }
  }

  onConfirmDestination() {
    this.confirmBtnOfDestClk = true;
    const destinationOptions = HistoryComponentMockData.getFieldOptions().DESTINATION_ALIGNMENT;
    const selectedDestinations = this.selectedDestination
      .map((selected, index) => selected ? destinationOptions[index] : null)
      .filter(dest => dest !== null);

    if (selectedDestinations.length > 0) {
      this.responseDataMethod(selectedDestinations.join(', '));
      // Auto-save after user selection
      setTimeout(() => this.autoSaveDraft(), 100);
    }
  }

  onConfirmBussiness() {
    this.confirmBtnOfBussClk = true;
    const businessOptions = HistoryComponentMockData.getFieldOptions().BUSINESS_ALIGNMENT;
    const selectedBusiness = this.selectedBussiness
      .map((selected, index) => selected ? businessOptions[index] : null)
      .filter(business => business !== null);

    if (selectedBusiness.length > 0) {
      this.responseDataMethod(selectedBusiness.join(', '));
      // Auto-save after user selection
      setTimeout(() => this.autoSaveDraft(), 100);
    }
  }

  // File management
  removeFile() {
    this.selectedFile = null;
    this.uploadFileName = '';
    this.fileUrlForChatUpload = '';
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleUserInput(this.userInput);
    }
  }

  onBlur() {
    // Handle blur event
  }

  onFocus() {
    // Handle focus event
  }

  onInput() {
    this.autoResize();
  }

  // Getter for additional comments field
  get isAdditionalCommentsEmpty(): boolean {
    const additionalCommentsLabel = HistoryComponentMockData.getFieldLabels().ADDITIONAL_COMMENTS;
    const additionalField = this.fields.find(
      (field) => field.label === additionalCommentsLabel
    );
    return !additionalField || !additionalField.value || additionalField.value.trim() === '';
  }

  scrollToBottom() {
    try {
      setTimeout(() => {
        const chatContainer = document.querySelector('.scroll-container');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.warn(HistoryComponentMockData.getBotMessages().SCROLL_ERROR, error);
    }
  }

  initializeTooltips() {
    try {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map((tooltipTriggerEl) => {
        // Dispose existing instance first
        const instance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (instance) {instance.dispose();}
        
        return new Tooltip(tooltipTriggerEl, {
          trigger: 'hover', // Only show on hover, not click
          placement: 'auto', // Auto placement
          container: 'body' // Append to body to avoid z-index issues
        });
      });
    } catch (error) {
      console.warn(HistoryComponentMockData.getBotMessages().TOOLTIP_ERROR, error);
    }
  }

  resetTextAreaSize() {
    if (this.textarea && this.textarea.nativeElement) {
      this.textarea.nativeElement.style.height = 'auto';
    }
  }

  filesSetForHistory() {
    // File handling logic for history
    if (this.chatHistory && this.chatHistory.length > 0) {
      this.chatHistory.forEach(chat => {
        if (chat.isFile && chat.fileName) {
          const extension = chat.fileName.substring(chat.fileName.lastIndexOf('.'));
          this.setFileIcon(extension);
        }
      });
    }
  }

  // Additional component methods would be added here to complete the implementation
  // This includes all the other functionality from the original component

  // Auto-save draft functionality for history component
  autoSaveDraft() {
    // Only save if we have meaningful conversation data and are in mock mode
    if (this.mockEnabled && this.sessionId && this.chatHistory && this.chatHistory.length > 0) {
      const userMessages = this.chatHistory.filter(msg => msg.sender === 'user');
      
      // Only save if there are user messages (meaningful conversation)
      if (userMessages.length > 0) {
        const draftData = {
          session_id: this.sessionId,
          user_name: this.userName || 'demo_user',
          timestamp: new Date().toISOString(),
          chatHistory: this.chatHistory,
          formFieldValue: this.fields.map(field => ({
            label: field.label,
            value: this.bicFieldData[field.label] || field.value || '',
            valid: field.valid,
            editing: field.editing,
            image: field.image,
            completed: field.completed
          })),
          submit: false
        };

        // Get existing drafts from session storage
        const existingDrafts = this.getDraftsFromSessionStorage();
        
        // Find and update existing draft or add new one
        const existingIndex = existingDrafts.findIndex(draft => draft.session_id === this.sessionId);
        
        if (existingIndex > -1) {
          // Update existing draft
          existingDrafts[existingIndex] = draftData;
        } else {
          // Add new draft (this shouldn't normally happen in history component)
          existingDrafts.unshift(draftData);
        }

        // Save to session storage
        sessionStorage.setItem('chat_drafts', JSON.stringify(existingDrafts));
        
        console.log('History Component: Draft auto-saved for session:', this.sessionId);
      }
    }
  }

  // Method to get drafts from session storage
  getDraftsFromSessionStorage(): any[] {
    const drafts = sessionStorage.getItem('chat_drafts');
    return drafts ? JSON.parse(drafts) : [];
  }

  detectMobile() {
    this.isMobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Add window resize listener to update mobile detection
    this.resizeListener = () => {
      this.isMobile = window.innerWidth < 768;
    };
    window.addEventListener('resize', this.resizeListener);
    
    return this.isMobile;
  }
}
