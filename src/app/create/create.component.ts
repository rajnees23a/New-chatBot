import {
  Component,
  NgZone,
  ElementRef,
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
import { Tooltip } from 'bootstrap';
import { Field } from './field.model';
import { APP_CONSTANTS } from '../constants';
import { MockResponseStage, MockDataService } from '../mock-data';
import { CreateComponentMockData } from './create.component.mock';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent
  implements OnDestroy, AfterViewChecked, AfterViewInit
{
  staticText = APP_CONSTANTS.CREATE;
  private mockEnabled = true; // <-- Toggle this to switch between mock and real data
  private conversationStage = 0;
  private mockResponseStages: MockResponseStage[] = MockDataService.getChatbotConversationStages();
  private mockChatHistory: any[] = [];

  // Start with empty form - will be filled progressively during conversation
  private mockFormData: { [key: string]: string } = {};

  constructor(
    private api: ServiceService,
    private ngZone: NgZone,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = this.staticText.langForChat;

    this.recognition.onresult = (event: any) => {
      this.ngZone.run(() => {
        this.userInput = event.results[0][0].transcript;
      });
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }
  fileExtension: string = '';
  addfileExtension: string = '';
  isActive = false;
  createNew: boolean = true;
  botMultiQuestion: boolean = false;
  isListening = false;
  recognition: any;
  receivedValue: boolean | null = null;
  isCollapsed = false;
  @ViewChild('reviewModal') reviewModal!: ElementRef;
  @ViewChild('chatContainerBox') chatContainerBox!: ElementRef;
  @ViewChild('tooltipRef', { static: false }) tooltipElement!: ElementRef;
  tooltipInstance: Tooltip | undefined;
  staticBotMsg = false;
  selectedFile: File | null = null;
  fileUploadFromAttachment: any;
  fileIcon: string = '';
  fileUrlForChatUpload: string = '';
  fileUrlForAttachmentUpload: string = '';
  uploadFileName: string = '';
  uploadFileFirstTime = false;
  errorDivVisible = false;
  errorDivText = '';
  successDivVisible = false;
  successDivText = '';
  fileUploadFromChatBot: File | null = null;
  allLooksGoodCliced: boolean = false;

  userInput: string = '';
  chatHistory: any[] = [];
  fields: Field[] = [...APP_CONSTANTS.FIELDS];
  bicFieldData: { [key: string]: string } = {};
  botChatMessage: string = '';
  apiResponseData: any;
  progress = 0;
  loader = false;
  botButtonResponse: string[] = [];
  editFieldVal = '';
  buttonDisabled = true;
  editButtonClicked = false;
  sessionId = this.api.userName;
  selectedOptionsofDropdown = '';
  allFieldssLookGoodButton = true;
  showChatDelete = false;
  showAttachmentDelete = false;
  dataa = {
    session_id: this.sessionId,
    user_name: this.api.userName,
    user_message: '',
    edit_field: '',
    confirmation: 'False',
  };
  selectedIndexOfButton: number | null = null;
  submitButtonClicked = false;
  submissionSuccessful = false;
  modalSubmitted = false;
  botRespondedFirstTime = false;
  comingFromCreate = '';
  selectedAreas: boolean[] = [];
  selectedDestination: boolean[] = [];
  userComeFirstTime = true;
  @ViewChild('autoResizeTextarea') textarea!: ElementRef<HTMLTextAreaElement>;
  bussinessMappingButtonClicke = false;
  bussinessUserInputForMappingButtons = '';
  itMappingButtonClicke = false;
  itUserInputForMappingButtons = '';
  bussinessDropDownKey = '';
  itDropDownKey = '';
  // Index mapping based on design for progress % - Total 24 fields = 100% (excluding Additional attachments field #23)
  groupA = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 9 required fields - 6% each = 54%
  groupB = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]; // 10 fields - 3% each = 30%
  groupC = [19, 20, 21, 22, 24]; // 5 fields - 3.2% each = 16% total (excluding index 23: Additional attachments)
  progressPercentage: number = 0;
  confirmBtnOfAreaClk = false;
  confirmBtnOfDestClk = false;
  confirmBtnOfBussClk = false;
  selectedBussiness: boolean[] = [];
  isMobile = window.innerWidth < 768;

  ngOnInit() {
    if (
      sessionStorage.getItem('userFirstTime') &&
      sessionStorage.getItem('userFirstTime') === 'false'
    ) {
      this.userComeFirstTime = false;
    }
    this.sessionId = this.generateSessionId();
    this.dataa.session_id = this.sessionId;
    
    // Load mock data for demo or real data for production
    if (this.mockEnabled) {
      this.loadMockData();
    } else {
      // Original initialization for real data
      this.chatHistory.push({
        text: this.staticText.bot_default_message,
        sender: this.staticText.senderBot,
      });
      this.chatHistory.push({
        text: {
          question: this.staticText.guideQuestionTitle,
          guidelines: this.staticText.bot_default_guideText,
        },
        sender: this.staticText.senderBot,
        staticBotMessage: true,
      });
      this.chatHistory.push({
        followingText: {
          question: this.staticText.followingQuestionTitle,
          hints: this.staticText.bot_default_following,
        },
        sender: this.staticText.senderBot,
      });
    }

    window.onbeforeunload = (_event) => {
      // Auto-save draft when user is about to leave the page (only if not submitting)
      if (!this.submitButtonClicked && !this.submissionSuccessful && !this.modalSubmitted) {
        this.saveCurrentConversationAsDraft();
      }
    };

    // Subscribe to service actions for new conversation trigger
    this.api.action$.subscribe(action => {
      if (action.triggered && action.message === 'start_new_conversation') {
        this.startNewConversation();
        this.api.resetAction(); // Reset the action state
      }
    });
  }

  // Method to save current conversation to session storage as draft
  saveCurrentConversationAsDraft() {
    // Don't save as draft if submission is in progress, was successful, or submitted via modal
    if (this.submitButtonClicked || this.submissionSuccessful || this.modalSubmitted) {
      console.log('Create Component: Skipping draft save - submission in progress, completed, or submitted via modal');
      return;
    }
    
    // Only save if there's meaningful conversation (more than initial bot messages)
    const userMessages = this.chatHistory.filter(msg => msg.sender === 'user');
    if (userMessages.length > 0 && this.hasAnyFilledFields()) {
      const draftData = {
        session_id: this.sessionId,
        user_name: this.api.userName || 'demo_user',
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

      // Only get existing drafts if they already exist, don't create empty array
      const existingDraftsString = sessionStorage.getItem('chat_drafts');
      const existingDrafts = existingDraftsString ? JSON.parse(existingDraftsString) : [];
      
      const existingIndex = existingDrafts.findIndex((draft: any) => draft.session_id === this.sessionId);
      
      if (existingIndex > -1) {
        existingDrafts[existingIndex] = draftData;
      } else {
        existingDrafts.unshift(draftData);
      }

      sessionStorage.setItem('chat_drafts', JSON.stringify(existingDrafts));
      console.log('Create Component: Draft saved to session storage');
      
      // Note: No need to notify service as left-nav reads directly from session storage
    }
  }

  // Method to get drafts from session storage
  getDraftsFromSessionStorage(): any[] {
    const drafts = sessionStorage.getItem('chat_drafts');
    return drafts ? JSON.parse(drafts) : [];
  }

  // Method to check if any fields are filled
  hasAnyFilledFields(): boolean {
    return this.fields.some(field => 
      field.value?.trim() !== '' && 
      field.value !== this.staticText.ADA_STATIC_TEXT &&
      this.bicFieldData[field.label]?.trim() !== ''
    );
  }

  // Method to handle new conversation (when + button is clicked)
  startNewConversation() {
    // Save current conversation as draft first (only if there's meaningful content and not already submitted)
    const userMessages = this.chatHistory.filter(msg => msg.sender === 'user');
    if (userMessages.length > 0 && this.hasAnyFilledFields() && !this.submitButtonClicked && !this.submissionSuccessful && !this.modalSubmitted) {
      this.saveCurrentConversationAsDraft();
    }
    
    this.resetConversationState();
    
    this.sessionId = this.generateSessionId();
    this.dataa.session_id = this.sessionId;
    
    if (this.mockEnabled) {
      this.loadMockData();
    }
  }

  resetConversationState() {
    this.chatHistory = [];
    this.bicFieldData = {};
    this.conversationStage = 0;
    this.fields = this.fields.map(field => ({
      ...field,
      value: '',
      valid: false,
      completed: false,
      editing: false
    }));
    this.progress = 0;
    this.progressPercentage = 0;
    this.userInput = '';
    this.selectedFile = null;
    this.allFieldssLookGoodButton = true;
    this.buttonDisabled = true;
    this.loader = false;
  }

  loadMockData() {
    // Start with initial bot messages only - no pre-filled form
    this.chatHistory = [
      {
        text: this.staticText.bot_default_message,
        sender: this.staticText.senderBot,
      },
      {
        text: {
          question: this.staticText.guideQuestionTitle,
          guidelines: this.staticText.bot_default_guideText,
        },
        sender: this.staticText.senderBot,
        staticBotMessage: true,
      },
      {
        followingText: {
          question: this.staticText.followingQuestionTitle,
          hints: this.staticText.bot_default_following,
        },
        sender: this.staticText.senderBot,
      }
    ];
    
    // Start with empty form data - will be filled during conversation
    this.bicFieldData = {};
    this.conversationStage = 0;
    
    // Fields start empty
    this.fields = this.fields.map((field) => ({
      ...field,
      value: '',
      valid: false,
      completed: false
    }));
    
    // Update progress (should be 0% initially)
    this.progressBarUpdate();
  }

  ngAfterViewInit() {
    if (this.tooltipElement && this.tooltipElement.nativeElement) {
      this.tooltipInstance = new Tooltip(this.tooltipElement.nativeElement, {
        trigger: 'hover', // Only show on hover, not click
        placement: 'auto', // Auto placement
        container: 'body' // Append to body to avoid z-index issues
      });
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainerBox.nativeElement.scrollTop =
        this.chatContainerBox.nativeElement.scrollHeight;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      // Silently ignore scroll errors - non-critical UI operation
    }
  }

  autoResize(): void {
    const textArea = this.textarea.nativeElement;
    textArea.style.height = 'auto'; // Reset height
    textArea.style.height = `${textArea.scrollHeight}px`; // Set height based on content
  }

  handleUserInput(data: any) {
    if (this.selectedFile) {
      this.uploadFileName = this.selectedFile.name;
      this.fileUploadFromChatBot = this.selectedFile;
      this.chatHistory.push({
        isFile: true,
        fileName: this.selectedFile.name,
        fileUrl: this.fileUrlForChatUpload,
        sender: this.staticText.senderUser,
      });
      this.uploadFileFirstTime = true;
    }
    if (this.userInput) {
      this.chatHistory.push({
        text: this.userInput,
        sender: this.staticText.senderUser,
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
  }

  responseDataMethod(data: any) {
    this.dataa.user_message = data;
    if (this.dataa.edit_field === '') {
      this.staticBotMsg = true;
      this.dataa.confirmation = 'True';
    }
    
    if (this.mockEnabled) {
      // Simulate API response with mock data
      this.simulateMockApiResponse(data);
    } else {
      // Original API call
      this.api.sendData(this.dataa, this.selectedFile).subscribe({
        next: (_response) => {
          this.botRespondedFirstTime = true;
          this.loader = false;
          this.apiResponseData = _response;
          if (this.apiResponseData) {
            if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'BIC')) {
              this.bicFieldData = this.formatObjectKeys(this.apiResponseData.BIC);
            }
            if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'bot_message')) {
              this.botChatMessage = this.apiResponseData.bot_message;
            }
            if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'button')) {
              this.botButtonResponse = this.apiResponseData.button;
            }
            this.processChatResponse();
            setTimeout(() => this.initializeTooltips(), 0);
          }
        },
        error: (_error) => {
          this.loader = false;
          this.chatHistory.push({
            text: this.staticText.sorryNetworkText,
            sender: this.staticText.senderBot,
          });
        },
        complete: () => {},
      });
    }
  }

  simulateMockApiResponse(_userMessage: string) {
    // Simulate API delay
    setTimeout(() => {
      this.loader = false;
      this.botRespondedFirstTime = true;
      
      let botResponse;
      
      // If editing a specific field, handle field-specific responses
      if (this.dataa.edit_field) {
        botResponse = this.generateMockBotResponse(_userMessage);
      } else {
        // Progressive conversation flow
        if (this.conversationStage < this.mockResponseStages.length) {
          const stage = this.mockResponseStages[this.conversationStage];
          
          // Update form data progressively
          Object.keys(stage.formUpdates).forEach(fieldLabel => {
            this.bicFieldData[fieldLabel] = (stage.formUpdates as any)[fieldLabel];
            this.mockFormData[fieldLabel] = (stage.formUpdates as any)[fieldLabel];
          });
          
          botResponse = {
            message: stage.botMessage,
            buttons: stage.buttons || [],
            dropdown: stage.dropdown || [],
            fieldName: stage.fieldName || ''
          };
          
          this.conversationStage++;
        } else {
          // Fallback for additional questions
          botResponse = this.generateMockBotResponse(_userMessage);
        }
      }
      
      // Store response data for processing (don't add to chat history yet - processChatResponse will handle it)
      this.botChatMessage = botResponse.message;
      this.botButtonResponse = botResponse.buttons || [];
      this.chatHistory.push({
        text: botResponse.message,
        sender: 'bot',
        button: botResponse.buttons || [],
        dropdown: botResponse.dropdown || [],
        mappingButton: botResponse.mappingButton || [],
        fieldName: botResponse.fieldName || ''
      });

      if (this.dataa.edit_field && this.mockFormData[this.dataa.edit_field]) {
        this.bicFieldData[this.dataa.edit_field] = this.mockFormData[this.dataa.edit_field];
      }

      this.progressBarUpdate();
      this.allFieldssLookGoodButton = false;
      setTimeout(() => this.initializeTooltips(), 0);
      
    }, 1500); // Simulate 1.5 second API delay
  }

  generateMockBotResponse(_userMessage: string): any {
    const currentField = this.dataa.edit_field;
    
    // If editing a specific field, use the centralized mock data
    if (currentField) {
      return CreateComponentMockData.generateFieldResponse(currentField);
    }
    
    // General conversation responses
    return CreateComponentMockData.getRandomGeneralResponse();
  }

  // This function is called when the user focuses on the textarea
  onFocus(): void {
    const div1 = document.getElementById('textArDiv');
    const div3 = document.getElementById('textAbut');
    if (div1) {
      div1.classList.add('active');
    }
    if (div3) {
      div3.classList.add('primaryeffect');
    }
  }

  onBlur() {
    const div1 = document.getElementById('textArDiv');
    const div3 = document.getElementById('textAbut');
    if (div1) {
      div1.classList.remove('active');
    }
    if (div3) {
      if (this.userInput === '' && !this.selectedFile) {
        div3.classList.remove('primaryeffect');
      }
    }
  }

  // This function is called on every input in the textarea
  onInput(): void {
    const div3 = document.getElementById('textAbut');
    if (div3) {
      div3.classList.add('primaryeffect');
    }
    this.autoResize();
  }

  resetTextAreaSize(): void {
    const textAreas = document.querySelectorAll('textarea');
    textAreas.forEach((element: HTMLTextAreaElement) => {
      // Reset the height of all textareas
      element.style.height = 'auto';
    });
  }

  toggleButton() {
    const div1 = document.getElementById('rowBox');
    const div2 = document.getElementById('rightBox');
    if (div1 && div2) {
      this.isActive = !this.isActive;
      const newTitle = this.isActive ? 'Open' : 'Collapse';
      const tooltipEl = this.tooltipElement.nativeElement;
      tooltipEl.setAttribute('data-bs-original-title', newTitle); // <- THIS IS IMPORTANT
      tooltipEl.setAttribute('title', newTitle);

      if (this.tooltipInstance) {
        this.tooltipInstance.dispose(); // destroy old instance
        this.tooltipInstance = new Tooltip(tooltipEl, {
          trigger: 'hover', // Only show on hover, not click
          placement: 'auto', // Auto placement
          container: 'body' // Append to body to avoid z-index issues
        }); // create new instance
      }
      if (this.isActive) {
        div1.classList.add('fieldresize');
      } else {
        div1.classList.remove('fieldresize');
      }
    }
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  processChatResponse() {
    this.allFieldssLookGoodButton = false;
    if (this.staticBotMsg === true) {
      this.chatHistory.push({
        text: this.botChatMessage,
        sender: this.staticText.senderBot,
        button: this.botButtonResponse,
      });
    } else {
      this.chatHistory.push({
        text: this.botChatMessage,
        sender: this.staticText.senderBot,
      });
    }
    this.progressBarUpdate();
  }

  progressBarUpdate() {
    this.progress = 0;
    this.fields = this.fields.map((field) => ({
      ...field,
      value: this.bicFieldData[field.label] || '',
      // Preserve the completed status - only update value, don't auto-complete
    }));
    if (this.uploadFileName !== undefined && this.fields[23]) {
      this.fields[23].value = this.uploadFileName;
    }
    this.fields.forEach((field, _index) => {
      const isFilled =
        field.value.trim() !== '' &&
        field.value !== this.staticText.ADA_STATIC_TEXT;
      if (isFilled) {
        if (this.groupA.includes(_index)) {
          this.progress += 6; // 9 fields × 6% = 54%
        } else if (this.groupB.includes(_index)) {
          this.progress += 3; // 10 fields × 3% = 30%
        } else if (this.groupC.includes(_index)) {
          this.progress += 3.2; // 5 fields × 3.2% = 16% (total: 54+30+16=100%)
        }
        // Note: Index 23 (Additional attachments) is excluded from progress calculation
      }
    });

    // Ensure exactly 100% when all counted fields are filled, but cap at 100%
    this.progressPercentage = Math.min(Math.round(this.progress), 100);
    this.checkFirst10Completed();
  }

  dropDownSel() {
    this.userInput = this.selectedOptionsofDropdown[0];
    this.dataa.edit_field = this.editFieldVal;
  }

  startListening() {
    if (!this.isListening) {
      this.isListening = true;
      this.recognition.start();
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    // Allowed file types
    const allowedExtensions = [
      '.pdf',
      '.ppt',
      '.pptx',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
    ];
    const maxSize = 20 * 1024 * 1024; // 20 MB in bytes

    // Get file extension
    const fileName = file.name;
    this.fileExtension = fileName
      .substring(fileName.lastIndexOf('.'))
      .toUpperCase();
    const localfileExtension = fileName
      .substring(fileName.lastIndexOf('.'))
      .toLowerCase();

    // Check file type
    if (!allowedExtensions.includes(localfileExtension)) {
      this.errorDivText =
        this.staticText.notSupportedText + ' ' + localfileExtension;
      this.errorDivCloseAfterSec();
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      this.errorDivText = this.staticText.fileSizeExceededText;
      this.errorDivCloseAfterSec();
      return;
    }
    // For now, set a default file icon based on extension
    if (localfileExtension === '.doc' || localfileExtension === '.docx') {
      this.fileIcon = 'assets/images/docs.png'; // Replace with actual icon path
    } else if (
      localfileExtension === '.ppt' ||
      localfileExtension === '.pptx'
    ) {
      this.fileIcon = 'assets/images/ppt-new.png'; // Replace with actual icon path
    } else if (localfileExtension === '.pdf') {
      this.fileIcon = 'assets/images/pdf-download.png'; // Replace with actual icon path
    } else if (
      localfileExtension === '.xls' ||
      localfileExtension === '.xlsx'
    ) {
      this.fileIcon = 'assets/images/xl.png'; // Replace with actual icon path
    } else {
      this.fileIcon = 'assets/images/doc-download.png'; // Replace with a default icon
    }
    this.selectedFile = file;
    const div3 = document.getElementById('textAbut');
    if (div3) {
      div3.classList.add('primaryeffect');
    }
    this.fileUrlForChatUpload = URL.createObjectURL(file);
  }

  onFileAttach(event: any) {
    const file: File = event.target.files[0];
    // Allowed file types
    const allowedExtensions = [
      '.pdf',
      '.ppt',
      '.pptx',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
    ];
    const maxSize = 20 * 1024 * 1024; // 20 MB in bytes

    // Get file extension
    const fileName = file.name;
    this.addfileExtension = fileName
      .substring(fileName.lastIndexOf('.'))
      .toUpperCase();
    const localExt = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

    // Check file type
    if (!allowedExtensions.includes(localExt)) {
      this.errorDivText = this.staticText.notSupportedText + ' ' + localExt;
      this.errorDivCloseAfterSec();
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      this.errorDivText = this.staticText.largerThan;
      this.errorDivCloseAfterSec();
      return;
    }
    // For now, set a default file icon based on extension
    if (localExt === '.doc' || localExt === '.docx') {
      this.fileIcon = 'assets/images/docs.png';
    } else if (localExt === '.ppt' || localExt === '.pptx') {
      this.fileIcon = 'assets/images/ppt-new.png';
    } else if (localExt === '.pdf') {
      this.fileIcon = 'assets/images/pdf-download.png';
    } else if (localExt === '.xls' || localExt === '.xlsx') {
      this.fileIcon = 'assets/images/xl.png';
    } else {
      this.fileIcon = 'assets/images/doc-download.png';
    }
    this.fileUploadFromAttachment = file;
    this.fileUrlForAttachmentUpload = URL.createObjectURL(file);
    this.uploadFileFirstTime = true;
    this.fields[23].value = fileName;
    if (this.fileUploadFromAttachment) {
      const dataa = { session_id: this.sessionId, user_name: this.api.userName };

      this.api.attachFile(dataa, this.fileUploadFromAttachment).subscribe({
        next: (_response) => {
          this.apiResponseData = _response;
          if (this.apiResponseData) {
            this.successDivText = this.staticText.attachFile;
            this.progress += 2;
            this.progressPercentage = Math.min(this.progress, 100);
            this.successDivCloseAfterSec();
            setTimeout(() => {
              this.initializeTooltips();
            });
          }
        },
        error: (_error) => {
          this.errorDivText = this.staticText.errorDiv;
          this.errorDivCloseAfterSec();
        },
        complete: () => {},
      });
    }
  }

  deleteAttachment() {
    this.fileUploadFromAttachment = null;
    this.fileIcon = '';
    this.successDivText = this.staticText.deleteFile;
    this.successDivCloseAfterSec();
    this.uploadFileFirstTime = false;
    this.showAttachmentDelete = false;
    this.fields[23].value = '';
    this.progress -= 2;
    this.progressPercentage = Math.min(this.progress, 100);
  }

  // Trigger the download of the file
  downloadFileFromChat() {
    const link = document.createElement('a');
    link.href = this.fileUrlForChatUpload;
    link.download = this.uploadFileName; // Set the name of the file for download
    link.click(); // Programmatically trigger the download
  }

  downloadFileFromAdditional() {
    const link = document.createElement('a');
    link.href = this.fileUrlForAttachmentUpload;
    link.download = this.fileUploadFromAttachment.name; // Set the name of the file for download
    link.click(); // Programmatically trigger the download
  }

  errorDivCloseAfterSec() {
    this.errorDivVisible = true;
    setTimeout(() => {
      this.errorDivVisible = false;
    }, 5000);
  }

  errorDivCloseInstant() {
    this.errorDivVisible = false;
  }

  successDivCloseAfterSec() {
    this.successDivVisible = true;
    setTimeout(() => {
      this.successDivVisible = false;
    }, 9000);
  }

  successDivCloseInstant() {
    this.successDivVisible = false;
  }

  removeFile() {
    this.selectedFile = null;
    this.fileIcon = '';
  }

  formatObjectKeys(obj: { [key: string]: string }): { [key: string]: string } {
    const formattedObj: { [key: string]: string } = {};
    for (const key in obj) {
      if (obj[key] === this.staticText.noInformation) {
        obj[key] = this.staticText.ADA_STATIC_TEXT;
      }
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const words = key.split(' ');
        if (words.length > 1) {
          words[1] = words[1].toLowerCase();
        }
        formattedObj[words.join(' ')] = obj[key];
      }
    }
    return formattedObj;
  }

  yesNoButton(value: any, index?: any) {
    this.selectedIndexOfButton = index;
    if (value === this.staticText.yesEverything) {
      this.chatHistory.push({
        text: value,
        sender: this.staticText.senderUser,
        isFile: false,
      });
      this.loader = true;
      this.dataa = {
        session_id: this.sessionId,
        user_name: this.api.userName,
        user_message: value,
        edit_field: '',
        confirmation: this.staticText.false,
      };
      this.api.sendData(this.dataa).subscribe({
        next: (_response) => {
          this.loader = false;
          this.allLooksGoodCliced = true;
          this.successDivText = this.staticText.successADAContent;
          this.successDivCloseAfterSec();
          this.apiResponseData = _response;
          if (this.apiResponseData) {
            if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'BIC')) {
              this.bicFieldData = this.formatObjectKeys(
                this.apiResponseData.BIC
              );
            }
            if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'bot_message')) {
              this.botChatMessage = this.apiResponseData.bot_message;
            }

            if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'button')) {
              this.botButtonResponse = this.apiResponseData.button;
            }
            this.chatHistory.push({
              text: this.botChatMessage,
              sender: this.staticText.senderBot,
              button: this.botButtonResponse,
            });
            this.staticBotMsg = false;
            this.dataa.confirmation = this.staticText.false;
            this.fields = this.fields.map((field) => ({
              ...field,
              value: this.bicFieldData[field.label] || '',
            }));
            this.fields.forEach((field) => {
              if (
                field.value !== '' &&
                field.value !== this.staticText.ADA_STATIC_TEXT
              ) {
                field.completed = true;
              }
            });
            this.progressBarUpdate();
          }
        },
        error: (_err) => {},
        complete: () => {},
      });
    } else if (value === this.staticText.noCheck) {
      this.chatHistory.push({
        text: value,
        sender: this.staticText.senderUser,
        isFile: false,
      });
      this.loader = true;
      this.dataa = {
        session_id: this.sessionId,
        user_name: this.api.userName,
        user_message: value,
        edit_field: '',
        confirmation: 'False',
      };
      this.api.sendData(this.dataa).subscribe({
        next: (_response) => {
          this.loader = false;
          this.apiResponseData = _response;
          if (this.apiResponseData) {
            if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'BIC')) {
              this.bicFieldData = this.formatObjectKeys(
                this.apiResponseData.BIC
              );
            }
            if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'bot_message')) {
              this.botChatMessage = this.apiResponseData.bot_message;
            }

            if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'button')) {
              this.botButtonResponse = this.apiResponseData.button;
            }
            this.staticBotMsg = false;
            this.dataa.confirmation = 'False';
            this.chatHistory.push({
              text: this.botChatMessage,
              sender: this.staticText.senderBot,
              button: this.botButtonResponse,
            });
          }
        },
        error: (_err) => {},
        complete: () => {},
      });

      this.fields.forEach((field) => {
        if (
          field.value !== '' &&
          field.value !== this.staticText.ADA_STATIC_TEXT
        ) {
          field.completed = true;
        }
      });
    } else {
      this.editFieldVal = value;
      this.chatHistory.push({
        text: value,
        sender: this.staticText.senderUser,
        isFile: false,
      });
      this.loader = true;
      this.dataa = {
        session_id: this.sessionId,
        user_name: this.api.userName,
        user_message: '',
        edit_field: value,
        confirmation: 'False',
      };
      this.api.sendData(this.dataa).subscribe({
        next: (_response) => {
          this.loader = false;
          this.apiResponseData = _response;
          if (this.apiResponseData) {
            if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'BIC')) {
              this.bicFieldData = this.formatObjectKeys(
                this.apiResponseData.BIC
              );
            }
            if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'bot_message')) {
              this.botChatMessage = this.apiResponseData.bot_message;
            }

            if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'button')) {
              this.botButtonResponse = this.apiResponseData.button;
            }
            if (typeof this.botChatMessage !== 'string') {
              if (
                this.botButtonResponse.length > 0 &&
                this.apiResponseData.drop_down === true
              ) {
                this.chatHistory.push({
                  text: {
                    question: this.botChatMessage['Question'],
                    guidelines: this.splitByDot(
                      this.botChatMessage['Guidelines']
                    ),
                  },
                  dropdown: this.botButtonResponse,
                  sender: this.staticText.senderBot,
                  fieldName: value,
                });
              } else if (
                this.botButtonResponse.length > 0 &&
                this.apiResponseData.drop_down === false
              ) {
                this.chatHistory.push({
                  text: {
                    question: this.botChatMessage['Question'],
                    guidelines: this.splitByDot(
                      this.botChatMessage['Guidelines']
                    ),
                  },
                  mappingButton: this.botButtonResponse,
                  sender: this.staticText.senderBot,
                  fieldName: value,
                });
              } else {
                this.chatHistory.push({
                  text: {
                    question: this.botChatMessage['Question'],
                    guidelines: this.splitByDot(
                      this.botChatMessage['Guidelines']
                    ),
                  },
                  sender: this.staticText.senderBot,
                });
              }
            }
            this.staticBotMsg = false;
            this.dataa.confirmation = 'False';
            this.fields = this.fields.map((field) => ({
              ...field,
              value: this.bicFieldData[field.label] || '',
            }));
            this.progressBarUpdate();
          }
        },
        error: (_err) => {},
        complete: () => {},
      });
    }
    this.checkFirst10Completed();
    setTimeout(() => {
      this.initializeTooltips();
    });
  }

  businessMappingButtonClicked(value: any) {
    this.bussinessMappingButtonClicke = true;
    this.bussinessDropDownKey = value;
  }

  businessConfirmButton() {
    this.chatHistory.push({
      text: `${this.bussinessDropDownKey}, ${this.bussinessUserInputForMappingButtons}`,
      sender: this.staticText.senderUser,
      isFile: false,
    });
    this.loader = true;
    this.dataa.edit_field = this.editFieldVal;
    this.dataa.user_message = `${this.bussinessDropDownKey}, ${this.bussinessUserInputForMappingButtons}`;
    this.dataa.confirmation = 'True';
    this.staticBotMsg = true;
    this.api.sendData(this.dataa).subscribe({
      next: (_response) => {
        this.loader = false;
        this.apiResponseData = _response;
        if (this.apiResponseData) {
          if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'BIC')) {
            this.bicFieldData = this.formatObjectKeys(this.apiResponseData.BIC);
          }
          if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'bot_message')) {
            this.botChatMessage = this.apiResponseData.bot_message;
          }

          if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'button')) {
            this.botButtonResponse = this.apiResponseData.button;
          }
          this.processChatResponse();
          this.staticBotMsg = false;
          this.dataa.confirmation = 'False';
          setTimeout(() => {
            this.initializeTooltips();
          });
        }
      },
      error: (_err) => {},
      complete: () => {},
    });
  }

  itMappingButtonClicked(value: any) {
    this.itMappingButtonClicke = true;
    this.itDropDownKey = value;
  }

  itConfirmButton() {
    this.chatHistory.push({
      text: `${this.itDropDownKey}, ${this.itUserInputForMappingButtons}`,
      sender: this.staticText.senderUser,
      isFile: false,
    });
    this.loader = true;
    this.dataa.edit_field = this.editFieldVal;
    this.dataa.user_message = `${this.itDropDownKey}, ${this.itUserInputForMappingButtons}`;
    this.dataa.confirmation = 'True';
    this.staticBotMsg = true;
    this.api.sendData(this.dataa).subscribe({
      next: (_response) => {
        this.loader = false;
        this.apiResponseData = _response;
        if (this.apiResponseData) {
          if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'BIC')) {
            this.bicFieldData = this.formatObjectKeys(this.apiResponseData.BIC);
          }
          if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'bot_message')) {
            this.botChatMessage = this.apiResponseData.bot_message;
          }

          if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'button')) {
            this.botButtonResponse = this.apiResponseData.button;
          }
          this.processChatResponse();
          this.staticBotMsg = false;
          this.dataa.confirmation = 'False';
          setTimeout(() => {
            this.initializeTooltips();
          });
        }
      },
      error: (_err) => {},
      complete: () => {},
    });
  }

  handleBooleanValue(value: boolean) {
    this.receivedValue = value;
    this.createNew = this.receivedValue;
  }

  splitByDot(str: string): string[] {
    // This regex splits on periods not part of common abbreviations like "e.g."
    return str
      .split(/(?<!\b(?:e|i)\.g)\.(?!\S)/gi) // doesn't split on e.g. or i.e.
      .map((item) => item.trim())
      .filter((item) => item !== '');
  }

  validateField(field: any) {
    field.valid = field.value.length > 5;
  }

  checkFirst10Completed() {
    const first10Fields = this.fields.slice(0, 9); // Get first 10 elements
    let allCompleted = true;
    for (const field of first10Fields) {
      if (field.value === '' || field.value === this.staticText.ADA_STATIC_TEXT) {
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

  editField(field: any) {
    field.editing = true;
  }

  checkButton(indexVal: any) {
    this.successDivText = this.staticText.successADAContent;
    this.successDivCloseAfterSec();
    this.fields[indexVal].completed = true;
  }

  editButton(indexVal: any) {
    if (this.fields[indexVal].label === this.staticText.areaInvolvedText) {
      this.addButton(indexVal);
      setTimeout(() => {
        this.confirmBtnOfAreaClk = false;
      }, 0);
    } else if (this.fields[indexVal].label === this.staticText.destinationText) {
      this.addButton(indexVal);
      setTimeout(() => {
        this.confirmBtnOfDestClk = false;
      }, 0);
    } else if (
      this.fields[indexVal].label === this.staticText.bussinessImpactText
    ) {
      this.addButton(indexVal);
      setTimeout(() => {
        this.confirmBtnOfBussClk = false;
      }, 0);
    } else if (
      this.fields[indexVal].label === this.staticText.businessSponsorText
    ) {
      this.bussinessMappingButtonClicke = false;
      this.bussinessUserInputForMappingButtons = '';
      this.addButton(indexVal);
    } else if (this.fields[indexVal].label === this.staticText.itSponsorText) {
      this.itMappingButtonClicke = false;
      this.itUserInputForMappingButtons = '';
      this.addButton(indexVal);
    } else if (this.fields[indexVal].label === this.staticText.timelinesText) {
      this.addButton(indexVal);
    } else if (this.fields[indexVal].label === this.staticText.portfolioText) {
      this.addButton(indexVal);
    } else {
      this.userInput = this.fields[indexVal].value;
      this.dataa.edit_field = this.fields[indexVal].label;
      this.dataa.confirmation = this.staticText.false;
      this.editButtonClicked = true;
      setTimeout(() => {
        const textArea = this.textarea.nativeElement;
        textArea.style.height = 'auto'; // Reset height
        textArea.style.height = `${textArea.scrollHeight}px`; // Recalculate after update
      }, 0);
    }
  }

  AllGoodButton() {
    this.allLooksGoodCliced = true;
    this.chatHistory.push({
      text: this.staticText.goodToMe,
      sender: this.staticText.senderUser,
      isFile: false,
    });
    this.chatHistory.push({
      text: this.botChatMessage,
      sender: this.staticText.senderBot,
      button: this.botButtonResponse,
    });
    this.fields.forEach((field) => {
      if (
        field.value !== '' &&
        field.value !== this.staticText.ADA_STATIC_TEXT
      ) {
        field.completed = true;
      }
    });
    this.checkFirst10Completed();
  }

  showAttachmentDeleteMethod() {
    this.showAttachmentDelete = !this.showAttachmentDelete;
  }

  showChatDeleteMethod() {
    this.showChatDelete = !this.showChatDelete;
  }

  addButton(indexVal: any) {
    this.editFieldVal = this.fields[indexVal].label;
    this.chatHistory.push({
      text: this.fields[indexVal].label,
      sender: this.staticText.senderUser,
      isFile: false,
    });
    this.loader = true;
    this.dataa = {
      session_id: this.sessionId,
      user_name: this.api.userName,
      user_message: '',
      edit_field: this.fields[indexVal].label,
      confirmation: this.staticText.false,
    };
    this.api.sendData(this.dataa).subscribe({
      next: (_response) => {
        this.loader = false;
        this.apiResponseData = _response;
        if (this.apiResponseData) {
          if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'BIC')) {
            this.bicFieldData = this.formatObjectKeys(this.apiResponseData.BIC);
          }
          if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'bot_message')) {
            this.botChatMessage = this.apiResponseData.bot_message;
          }

          if (Object.prototype.hasOwnProperty.call(this.apiResponseData, 'button')) {
            this.botButtonResponse = this.apiResponseData.button;
          }
          if (typeof this.botChatMessage !== 'string') {
            if (this.botButtonResponse !== null) {
              if (
                this.botButtonResponse.length > 0 &&
                this.apiResponseData.drop_down === true
              ) {
                this.chatHistory.push({
                  text: {
                    question: this.botChatMessage[this.staticText.question],
                    guidelines: this.splitByDot(
                      this.botChatMessage[this.staticText.guidelines]
                    ),
                  },
                  dropdown: this.botButtonResponse,
                  sender: this.staticText.senderBot,
                  fieldName: this.fields[indexVal].label,
                });
              } else if (
                this.botButtonResponse.length > 0 &&
                this.apiResponseData.drop_down === false
              ) {
                if (
                  this.checkIfArray(
                    this.botChatMessage[this.staticText.question]
                  )
                ) {
                  this.chatHistory.push({
                    text: {
                      question: this.botChatMessage[this.staticText.question],
                      guidelines: this.splitByDot(
                        this.botChatMessage[this.staticText.guidelines]
                      ),
                    },
                    mappingButton: this.botButtonResponse,
                    sender: this.staticText.senderBot,
                    fieldName: this.fields[indexVal].label,
                  });
                } else {
                  this.chatHistory.push({
                    text: {
                      question: this.botChatMessage[this.staticText.question],
                      guidelines: this.splitByDot(
                        this.botChatMessage[this.staticText.guidelines]
                      ),
                    },
                    button: this.botButtonResponse,
                    sender: this.staticText.senderBot,
                    fieldName: this.fields[indexVal].label,
                  });
                }
              } else {
                this.chatHistory.push({
                  text: {
                    question: this.botChatMessage[this.staticText.question],
                    guidelines: this.splitByDot(
                      this.botChatMessage[this.staticText.guidelines]
                    ),
                  },
                  sender: this.staticText.senderBot,
                });
              }
            } else {
              this.chatHistory.push({
                text: {
                  question: this.botChatMessage[this.staticText.question],
                  guidelines: this.splitByDot(
                    this.botChatMessage[this.staticText.guidelines]
                  ),
                },
                sender: this.staticText.senderBot,
              });
            }
          }
          this.staticBotMsg = false;
          this.dataa.confirmation = this.staticText.false;
          this.fields = this.fields.map((field) => ({
            ...field,
            value: this.bicFieldData[field.label] || '',
          }));
          this.progressBarUpdate();
          setTimeout(() => {
            this.initializeTooltips();
          });
        }
      },
      error: (_err) => {},
      complete: () => {},
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === this.staticText.enter) {
      if (event.shiftKey) {
        return;
      } else {
        event.preventDefault();
        this.handleUserInput(this.userInput);
      }
    }
  }

  // Function to generate a unique session ID
  generateSessionId(): string {
    return (
      this.generateRandomString(8) +
      '-' +
      this.generateRandomString(4) +
      '-' +
      this.generateRandomString(4) +
      '-' +
      this.generateRandomString(4) +
      '-' +
      this.generateRandomString(12) +
      this.generateRandomString(1)
    );
  }

  // Helper function to generate a random alphanumeric string of a given length
  generateRandomString(length: number): string {
    const characters = this.staticText.char;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  submitButtonPopup() {
    this.submitButtonClicked = true;
    const chatData = {
      chatHistory: this.chatHistory,
      formFieldValue: this.fields,
      submit: true,
    };
    const data = {
      session_id: this.sessionId,
      user_name: this.api.userName,
      session_data: chatData,
    };
    
    if (this.mockEnabled) {
      // Mock submit response
      setTimeout(() => {
        this.mockSubmitSuccess();
      }, 1000);
    } else {
      // Original API call
      this.api.submitData(data).subscribe({
        next: (_response) => {
          this.additionalDataForSubmit();
        },
        error: (_err) => {},
        complete: () => {},
      });
    }
  }

  mockSubmitSuccess() {
    // Show success message
    this.successDivText = this.staticText.successContent;
    this.successDivCloseAfterSec();
    
    // Simulate what would happen after successful submission
    this.additionalDataForSubmit();
  }

  submitButton() {
    // Set submission intent immediately when user clicks submit (before modal)
    this.submitButtonClicked = true;
    
    if (!this.allLooksGoodCliced) {
      const modalElement = document.getElementById(
        'reviewModal'
      ) as HTMLElement;
      if (modalElement) {
        const myModal = new bootstrap.Modal(modalElement);
        myModal.show();
        return;
      } else {
        // All required fields are filled - continue with normal flow
      }
    } else {
      this.submitButtonPopup();
    }
  }

  showmodal() {
    const modalElement = document.getElementById('reviewModal') as HTMLElement;
    if (modalElement) {
      const myModal = new bootstrap.Modal(modalElement);
      myModal.show();
    }
  }

  // Method to handle modal cancellation/closing without submission
  onModalCancel() {
    // Reset submission flag if user cancels modal without submitting
    this.submitButtonClicked = false;
    this.modalSubmitted = false;
    console.log('Create Component: Modal cancelled - reset submission flags');
  }

  additionalDataForSubmit() {
    const filled = this.fields.filter(
      (field) =>
        field.value.trim() !== '' &&
        field.value !== this.staticText.ADA_STATIC_TEXT
    ).length;
    const additionalData = {
      user_name: this.api.userName,
      session_id: this.sessionId,
      update_data: {
        Additional_Comments: '',
        Additional_Files: '',
        Total_no_of_questions_completed: filled.toString(),
        Submitted_date: this.datePipe.transform(new Date(), 'dd-MMM-yyyy'),
        Status: this.staticText.statusPending,
      },
    };
    if (this.fileUploadFromAttachment) {
      additionalData.update_data.Additional_Files =
        this.fileUploadFromAttachment;
    }
    
    if (this.mockEnabled) {
      // Remove the draft from session storage since it's being submitted
      this.removeDraftFromSessionStorage();
      this.submissionSuccessful = true;
      
      // Mock successful submission
      setTimeout(() => {
        this.api.triggerAction(this.staticText.generatedText);
        this.router.navigate(['/request']);
        setTimeout(() => {
          this.initializeTooltips();
        });
      }, 500);
    } else {
      // Original API call
      this.api.submitAdditionalData(additionalData).subscribe({
        next: (_response) => {
          // Remove the draft from session storage since it's being submitted
          this.removeDraftFromSessionStorage();
          this.submissionSuccessful = true;
          this.api.triggerAction(this.staticText.generatedText);
          this.router.navigate(['/request']);
          setTimeout(() => {
            this.initializeTooltips();
          });
        },
        error: (_err) => {},
        complete: () => {},
      });
    }
  }

  saveChatData() {
    const chatData = {
      chatHistory: this.chatHistory,
      formFieldValue: this.fields,
      submit: false,
    };
    const data = {
      session_id: this.sessionId,
      user_name: this.api.userName,
      session_data: chatData,
      timestamp: new Date().toString(),
    };

    if (this.mockEnabled) {
      // Save to mock data by calling a method on the left-nav component
      // We'll use the service to communicate this
      this.api.saveMockDraft(this.sessionId, this.api.userName, this.chatHistory, this.fields);
      
      // Simulate the same behavior as real API
      setTimeout(() => {
        this.initializeTooltips();
      });
    } else {
      // Original API call
      this.api.submitData(data).subscribe({
        next: (_response) => {
          const data = { user_name: this.api.userName };
          this.api.retriveData(data);
          setTimeout(() => {
            this.initializeTooltips();
          });
        },
        error: (_err) => {},
        complete: () => {},
      });
    }
  }

  onConfirmAreas() {
    this.confirmBtnOfAreaClk = true;
    const _selected = this.botButtonResponse.filter(
      (area: any, i: any) => this.selectedAreas[i]
    );
    this.chatHistory.push({
      text: this.getSelectedRegions(),
      sender: this.staticText.senderUser,
      isFile: false,
    });
    
    if (this.mockEnabled) {
      // Update mock form data with selection
      this.bicFieldData['Areas involved'] = this.getSelectedRegions();
      this.mockFormData['Areas involved'] = this.getSelectedRegions();
      this.progressBarUpdate();
    }
    
    this.loader = true;
    this.dataa.edit_field = this.editFieldVal;
    this.dataa.confirmation = this.staticText.true;
    this.staticBotMsg = true;
    this.responseDataMethod(this.getSelectedRegions());
  }

  onConfirmDestination() {
    this.confirmBtnOfDestClk = true;
    const _selected = this.botButtonResponse.filter(
      (area: any, i: any) => this.selectedDestination[i]
    );
    this.chatHistory.push({
      text: this.getSelectedDestination(),
      sender: this.staticText.senderUser,
      isFile: false,
    });
    
    if (this.mockEnabled) {
      // Update mock form data with selection
      this.bicFieldData['Destination 2027 alignment'] = this.getSelectedDestination();
      this.mockFormData['Destination 2027 alignment'] = this.getSelectedDestination();
      this.progressBarUpdate();
    }
    
    this.loader = true;
    this.dataa.edit_field = this.editFieldVal;
    this.dataa.confirmation = this.staticText.true;
    this.staticBotMsg = true;
    this.responseDataMethod(this.getSelectedDestination());
  }

  onConfirmBussiness() {
    this.confirmBtnOfBussClk = true;
    const _selected = this.botButtonResponse.filter(
      (area: any, i: any) => this.selectedBussiness[i]
    );
    this.chatHistory.push({
      text: this.getSelectedBussiness(),
      sender: this.staticText.senderUser,
      isFile: false,
    });
    this.loader = true;
    this.dataa.edit_field = this.editFieldVal;
    this.dataa.confirmation = this.staticText.true;
    this.staticBotMsg = true;
    this.responseDataMethod(this.getSelectedBussiness());
  }

  getSelectedRegions() {
    return this.botButtonResponse
      .filter((area: any, i: any) => this.selectedAreas[i])
      .join(', ');
  }

  getSelectedDestination() {
    return this.botButtonResponse
      .filter((area: any, i: any) => this.selectedDestination[i])
      .join(', ');
  }

  getSelectedBussiness() {
    return this.botButtonResponse
      .filter((area: any, i: any) => this.selectedBussiness[i])
      .join(', ');
  }

  hideCrousel() {
    this.userComeFirstTime = false;
  }

  initializeTooltips() {
    setTimeout(() => {
      const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        const instance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (instance) {instance.dispose();}
        new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }, 0);
  }

  checkIfArray(value: any): boolean {
    return Array.isArray(value);
  }

  timeLiButton(value: any, _index?: any) {
    this.chatHistory.push({
      text: value,
      sender: this.staticText.senderUser,
      isFile: false,
    });
    this.loader = true;
    this.dataa.edit_field = this.editFieldVal;
    this.dataa.confirmation = this.staticText.true;
    this.staticBotMsg = true;
    this.responseDataMethod(value);
  }

  get isAdditionalCommentsEmpty(): boolean {
    const additionalField = this.fields.find(
      (field) => field.label === this.staticText.additionalText
    );
    return additionalField ? additionalField.value === '' : false;
  }

  // Remove submitted draft from session storage
  // Remove submitted draft from session storage
  removeDraftFromSessionStorage() {
    if (this.mockEnabled && this.sessionId) {
      // Only proceed if chat_drafts already exists in session storage
      const existingDraftsString = sessionStorage.getItem('chat_drafts');
      if (existingDraftsString) {
        const existingDrafts = JSON.parse(existingDraftsString);
        const filteredDrafts = existingDrafts.filter((draft: any) => 
          draft.session_id !== this.sessionId
        );
        
        // If no drafts left, remove the entire session storage item
        if (filteredDrafts.length === 0) {
          sessionStorage.removeItem('chat_drafts');
          console.log('Create Component: Removed all drafts from session storage');
        } else {
          sessionStorage.setItem('chat_drafts', JSON.stringify(filteredDrafts));
          console.log('Create Component: Removed submitted draft from session storage:', this.sessionId);
        }
      } else {
        console.log('Create Component: No drafts found in session storage to remove');
      }
    }
  }

  ngOnDestroy() {
    // Don't save as draft if any submission process has started or completed
    if (this.submitButtonClicked || this.submissionSuccessful || this.modalSubmitted) {
      console.log('Create Component: Not saving as draft - submission process initiated or completed');
      // Reset flags for cleanup
      this.submitButtonClicked = false;
      this.submissionSuccessful = false;
      this.modalSubmitted = false;
      return; // Exit early without saving
    }
    
    // Only save if bot has responded and no submission was attempted
    if (this.botRespondedFirstTime === true) {
      this.saveChatData();
      this.api.triggerAction(this.staticText.draftSaved);
    }
  }
}
