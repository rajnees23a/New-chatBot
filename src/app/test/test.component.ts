import {
  Component,
  NgZone,
  ElementRef,
  Renderer2,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { SerrviceService } from '../serrvice.service';
import { DatePipe } from '@angular/common';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnDestroy {
  @ViewChild('waveCanvas') waveCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('autoResizeTextarea') inputRef!: ElementRef<HTMLInputElement>;
  transcript = '';
  isRecording = false;
  isSpeaking = false;
  recognition!: any;

  private audioContext!: AudioContext;
  private analyser!: AnalyserNode;
  private source!: MediaStreamAudioSourceNode;
  private dataArray!: Uint8Array;
  private animationFrameId: number | null = null;

  fileExtension: string = '';
  addfileExtension: string = '';

  constructor(
    private api: SerrviceService,
    private ngZone: NgZone,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en';
    this.recognition.interimResults = true;
    this.recognition.continuous = true;

    this.recognition.onresult = (event: any) => {
      const result = Array.from(event.results)
        .map((res: any) => res[0].transcript)
        .join('');
      this.userInput = result;
      this.cdr.detectChanges();
      setTimeout(() => {
        const inputEl = this.inputRef?.nativeElement;
        inputEl?.scrollTo?.(inputEl.scrollWidth, 0);
      });
    };

    this.recognition.onerror = () => {
      this.isRecording = false;
      this.isSpeaking = false;
      this.cdr.detectChanges();
    };
  }
  isActive = false;
  createNew: boolean = true;
  botMultiQuestion: boolean = false;
  isListening = false;

  receivedValue: boolean | null = null;
  isCollapsed = false;
  @ViewChild('reviewModal') reviewModal!: ElementRef;
  data = {
    session_id: '1234abcd',
    botmessage:
      'Let’s start by understanding your idea. Give me a brief overview, covering the key challenge and what you want to achieve',
    fieldText: 'Problem Statement',
    fieldValue: '',
    fieldStatus: false,
    guieText: [
      'What’s the problem? (What needs fixing or improving?)',
      'What’s your goal? (What do you want to achieve?)',
      'How will success be measured? (Think metrics or key results.)',
      'Is there urgency? (Any deadlines, priorities, or risks?)',
    ],
    following: [
      'Text input (Type your response)',
      'Attachment (Upload a PDF, Word, PPT or Excel file)',
      'Voice input (Record your response)',
    ],
  };
  staticBotMsg = false;
  selectedFile: File | null = null;
  fileUploadFromAttachment: any;
  fileIcon: string = '';
  fileUrlForChatUpload: any;
  fileUrlForAttachmentUpload: any;
  uploadFileName: any;
  uploadFileFirstTime = false;
  errorDivVisible = false;
  errorDivText = '';
  successDivVisible = false;
  successDivText = '';
  fileUploadFromChatBot: any;
  allLooksGoodCliced: boolean = false;

  userInput: string = '';
  chatHistory: any[] = [];
  fields = [
    {
      label: 'Your idea title',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/title.svg',
      completed: false,
      tooltip: 'Add static text here',
    },
    {
      label: 'Problem statement',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/problem-statement.svg',
      completed: false,
    },
    {
      label: 'Objective',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/objective.svg',
      completed: false,
    },
    {
      label: 'Key results',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/key-result.svg',
      completed: false,
    },
    {
      label: 'Key features',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/key-feature.svg',
      completed: false,
    },
    {
      label: 'Urgency',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/urgency.svg',
      completed: false,
    },
    {
      label: 'Areas involved',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/area-involved.svg',
      completed: false,
    },
    {
      label: 'Destination 2027 alignment',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/destination.svg',
      completed: false,
    },
    {
      label: 'Risks',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/risk.svg',
      completed: false,
    },
    {
      label: 'KPIs',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/key-result.svg',
      completed: false,
    },
    {
      label: 'Data needed',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/data-needed.svg',
      completed: false,
    },
    {
      label: 'Impact',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/impact.svg',
      completed: false,
    },
    {
      label: 'Implementation considerations',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/implementation.svg',
      completed: false,
    },
    {
      label: 'Dependencies',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/dependencies.svg',
      completed: false,
    },
    {
      label: 'Key dates',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/key-dates.svg',
      completed: false,
    },
    {
      label: 'Timelines',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/timeline.svg',
      completed: false,
    },
    {
      label: 'Business sponsor',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/business-sponsor.svg',
      completed: false,
    },
    {
      label: 'Budget details',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/budget-details.svg',
      completed: false,
    },
    {
      label: 'Stakeholders',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/stakeholders.svg',
      completed: false,
    },
    {
      label: 'Out of scope',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/scope.svg',
      completed: false,
    },
    {
      label: 'Business case impacts',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/business-case-impact.svg',
      completed: false,
    },
    {
      label: 'Portfolio alignment',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/portfolio-alignment.svg',
      completed: false,
    },
    {
      label: 'IT sponsor',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/it-sponsor.svg',
      completed: false,
    },
    {
      label: 'Additional attachments',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/additional-attachments.svg',
      completed: false,
    },
    {
      label: 'Additional comments',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/additional-comments.svg',
      completed: false,
    },
  ];
  bicFieldData: any;
  botChatMessage = 'Hello';
  apiResponseData: any;
  progress = 0;
  loader = false;
  botButtonResponse: any;
  editFieldVal = '';
  buttonDisabled = true;
  editButtonClicked = false;
  sessionId = this.api.userName;
  userM =
    'I would like to develop a global process to enable users from HMS Host and Autogrill to access Avolta Insights, which currently is only available for Dufry users. This impacts approximatly 30% of all users from the whole company, and will help the business visualize critical data on key business initiatives';
  selectedOptionsofDropdown = '';
  ADAtext =
    "ADA couldn't fill this field, please continue the conversation to fill it";
  allFieldssLookGoodButton = true;
  showChatDelete = false;
  showAttachmentDelete = false;
  dataa = {
    session_id: this.sessionId,
    user_name: this.api.userName,
    user_message: this.userM,
    edit_field: '',
    confirmation: 'False',
  };
  selectedIndexOfButton: number | null = null;
  submitButtonClicked = false;
  botRespondedFirstTime = false;
  comingFromCreate = '';
  selectedAreas: boolean[] = [];
  selectedDestination: boolean[] = [];
  userComeFirstTime = true;
  @ViewChild('autoResizeTextarea') textarea!: ElementRef<HTMLTextAreaElement>;
  placeholder = 'Reply to ADA';
  bussinessMappingButtonClicke = false;
  bussinessUserInputForMappingButtons = '';
  itMappingButtonClicke = false;
  itUserInputForMappingButtons = '';
  bussinessDropDownKey = '';
  itDropDownKey = '';
  // Index mapping based on design for progress %
  groupA = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 9 fields 6%
  groupB = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]; // 10 fields 3%
  groupC = [19, 20, 21, 22, 23, 24, 25]; // 7 fields 2%
  progressPercentage: any;
  confirmBtnOfAreaClk = false;
  confirmBtnOfDestClk = false;

  ngOnInit() {
    if (
      sessionStorage.getItem('userFirstTime') &&
      sessionStorage.getItem('userFirstTime') == 'false'
    ) {
      this.userComeFirstTime = false;
    }
    this.sessionId = this.generateSessionId();
    this.dataa.session_id = this.sessionId;
    this.chatHistory.push({ text: this.data.botmessage, sender: 'bot' });
    this.chatHistory.push({
      text: {
        question:
          'Let’s start with the basics! Share a brief description of your idea, covering',
        guidelines: this.data.guieText,
      },
      sender: 'bot',
      staticBotMessage: true,
    });
    this.chatHistory.push({
      followingText: {
        question: 'You can provide your response in one of the following ways',
        hints: this.data.following,
      },
      sender: 'bot',
    });

    window.onbeforeunload = (event) => {};
  }

  async setupMicAnalyzer() {
    try {
      if (this.audioContext?.state !== 'closed') {
        await this.audioContext?.close();
      }
      cancelAnimationFrame(this.animationFrameId!);

      this.audioContext = new AudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.source = this.audioContext.createMediaStreamSource(stream);

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64; // 32 bars
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      this.source.connect(this.analyser);
      this.drawWaveform(); // calls the updated bar-style version
    } catch (err) {
      console.error('Mic setup failed:', err);
    }
  }

  drawWaveform() {
    const canvas = this.waveCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const draw = () => {
      this.animationFrameId = requestAnimationFrame(draw);
      this.analyser.getByteFrequencyData(this.dataArray); // IMPORTANT: use frequency data

      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      const barWidth = 6; // THICK bars
      const gap = 2;
      let x = 0;
      let maxHeight = 0;

      for (let i = 0; i < this.dataArray.length; i++) {
        const barHeight = Math.max((this.dataArray[i] / 255) * HEIGHT, 4);
        ctx.fillStyle = '#000'; // dark bold bars
        ctx.fillRect(x, (HEIGHT - barHeight) / 2, barWidth, barHeight);
        if (barHeight > maxHeight) maxHeight = barHeight;
        x += barWidth + gap;
      }

      const speaking = maxHeight > 10;
      if (speaking !== this.isSpeaking) {
        this.isSpeaking = speaking;
        this.cdr.detectChanges();
      }
    };

    draw();
  }

  toggleRecording(): void {
    this.isRecording = true;
    this.userInput = '';
    this.recognition.start();
    this.setupMicAnalyzer(); // always re-setup
  }

  stopRecording(): void {
    this.isRecording = false;
    this.recognition.stop();
    this.isSpeaking = false;

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.suspend();
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    const ctx = this.waveCanvas?.nativeElement.getContext('2d');
    ctx?.clearRect(
      0,
      0,
      this.waveCanvas.nativeElement.width,
      this.waveCanvas.nativeElement.height
    );
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
  }

  responseDataMethod(data: any) {
    this.dataa.user_message = data;
    if (this.dataa.edit_field == '') {
      this.staticBotMsg = true;
      this.dataa.confirmation = 'True';
    }

    this.api.sendData(this.dataa, this.selectedFile).subscribe({
      next: (response) => {
        this.botRespondedFirstTime = true;
        this.loader = false;
        this.apiResponseData = response;
        if (this.apiResponseData) {
          if (this.apiResponseData.hasOwnProperty('BIC')) {
            this.bicFieldData = this.formatObjectKeys(this.apiResponseData.BIC);
          }
          if (this.apiResponseData.hasOwnProperty('bot_message')) {
            this.botChatMessage = this.apiResponseData.bot_message;
          }
          if (this.apiResponseData.hasOwnProperty('button')) {
            this.botButtonResponse = this.apiResponseData.button;
          }
          this.processChatResponse();
          setTimeout(() => {
            this.initializeTooltips();
          });
        }
      },
      error: (error) => {
        console.log('error', error);

        this.loader = false;
        this.chatHistory.push({
          text: 'Sorry for trouble,there is some network issues please try again',
          sender: 'bot',
        });
      },
      complete: () => console.log('Completed'),
    });
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
      if (this.userInput == '' && !this.selectedFile) {
        div3.classList.remove('primaryeffect');
      }
    }
  }

  // This function is called on every input in the textarea
  onInput(): void {
    // You could do any additional logic based on input if necessary
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
    if (this.staticBotMsg == true) {
      this.chatHistory.push({
        text: this.botChatMessage,
        sender: 'bot',
        button: this.botButtonResponse,
      });
    } else {
      this.chatHistory.push({ text: this.botChatMessage, sender: 'bot' });
    }
    this.progressBarUpdate();
  }

  progressBarUpdate() {
    this.progress = 0;
    this.fields = this.fields.map((field) => ({
      ...field,
      value: this.bicFieldData[field.label] || '', // Use mock data or default value
    }));
    if (this.uploadFileName) {
      this.fields[23].value = this.uploadFileName;
    }
    this.fields.forEach((field, index) => {
      const isFilled =
        field.value.trim() !== '' && field.value !== this.ADAtext;
      if (isFilled) {
        if (this.groupA.includes(index)) {
          this.progress += 6;
        } else if (this.groupB.includes(index)) {
          this.progress += 3;
        } else if (this.groupC.includes(index)) {
          this.progress += 2;
        }
      }
    });

    // Cap it at 100%
    this.progressPercentage = Math.min(this.progress, 100);
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
      .toLowerCase();

    // Check file type
    if (!allowedExtensions.includes(this.fileExtension)) {
      this.errorDivText =
        'Files of following format is not supported' + ' ' + this.fileExtension;
      this.errorDivCloseAfterSec();
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      this.errorDivText = 'You may not upload files larger than 20mb';
      this.errorDivCloseAfterSec();
      return;
    }
    // For now, set a default file icon based on extension
    if (this.fileExtension === '.doc' || this.fileExtension === '.docx') {
      this.fileIcon = 'assets/images/docs.png'; // Replace with actual icon path
    } else if (
      this.fileExtension === '.ppt' ||
      this.fileExtension === '.pptx'
    ) {
      this.fileIcon = 'assets/images/ppt-new.png'; // Replace with actual icon path
    } else if (this.fileExtension === '.pdf') {
      this.fileIcon = 'assets/images/pdf-download.png'; // Replace with actual icon path
    } else if (
      this.fileExtension === '.xls' ||
      this.fileExtension === '.xlsx'
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

  fileValidation(event: any) {
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
    const fileExtension = fileName
      .substring(fileName.lastIndexOf('.'))
      .toLowerCase();

    // Check file type
    if (!allowedExtensions.includes(fileExtension)) {
      this.errorDivText =
        'Files of following format is not supported' + ' ' + fileExtension;
      this.errorDivCloseAfterSec();
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      this.errorDivText = 'You may not upload files larger than 20mb';
      this.errorDivCloseAfterSec();
      return;
    }
    // For now, set a default file icon based on extension
    if (fileExtension === '.doc' || fileExtension === '.docx') {
      this.fileIcon = 'assets/images/docs.png'; // Replace with actual icon path
    } else if (fileExtension === '.ppt' || fileExtension === '.pptx') {
      this.fileIcon = 'assets/images/ppt-new.png'; // Replace with actual icon path
    } else if (fileExtension === '.pdf') {
      this.fileIcon = 'assets/images/pdf-download.png'; // Replace with actual icon path
    } else if (
      this.fileExtension === '.xls' ||
      this.fileExtension === '.xlsx'
    ) {
      this.fileIcon = 'assets/images/xl.png'; // Replace with actual icon path
    } else {
      this.fileIcon = 'assets/images/doc-download.png'; // Replace with a default icon
    }
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
      .toLowerCase();

    // Check file type
    if (!allowedExtensions.includes(this.addfileExtension)) {
      this.errorDivText =
        'Files of following format is not supported' +
        ' ' +
        this.addfileExtension;
      this.errorDivCloseAfterSec();
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      this.errorDivText = 'You may not upload files larger than 20mb';
      this.errorDivCloseAfterSec();
      return;
    }
    // For now, set a default file icon based on extension
    if (this.addfileExtension === '.doc' || this.addfileExtension === '.docx') {
      this.fileIcon = 'assets/images/docs.png'; // Replace with actual icon path
    } else if (
      this.addfileExtension === '.ppt' ||
      this.addfileExtension === '.pptx'
    ) {
      this.fileIcon = 'assets/images/ppt-new.png'; // Replace with actual icon path
    } else if (this.addfileExtension === '.pdf') {
      this.fileIcon = 'assets/images/pdf-download.png'; // Replace with actual icon path
    } else if (
      this.addfileExtension === '.xls' ||
      this.addfileExtension === '.xlsx'
    ) {
      this.fileIcon = 'assets/images/xl.png'; // Replace with actual icon path
    } else {
      this.fileIcon = 'assets/images/doc-download.png'; // Replace with a default icon
    }
    // this.fileValidation(event)
    this.fileUploadFromAttachment = file;
    this.fileUrlForAttachmentUpload = URL.createObjectURL(file);
    this.uploadFileFirstTime = true;
    if (this.fileUploadFromAttachment) {
      let dataa = { session_id: this.sessionId, user_name: this.api.userName };
      this.api.attachFile(dataa, this.fileUploadFromAttachment).subscribe({
        next: (response) => {
          this.apiResponseData = response;
          if (this.apiResponseData) {
            this.successDivText = 'Successfully attach the file';
            this.progress = 2;
            this.progressPercentage = Math.min(this.progress, 100);
            this.successDivCloseAfterSec();
            setTimeout(() => {
              this.initializeTooltips();
            });
          }
        },
        error: (error) => {
          this.errorDivText =
            'There is some error while uploading the file, please try again';
          this.errorDivCloseAfterSec();
        },
        complete: () => console.log('Completed'),
      });
    }
  }

  deleteAttachment() {
    this.fileUploadFromAttachment = null;
    this.fileIcon = '';
    this.successDivText = 'Successfully delete the file';
    this.successDivCloseAfterSec();
    this.uploadFileFirstTime = false;
  }

  // Trigger the download of the file
  downloadFileFromChat() {
    const link = document.createElement('a');
    link.href = this.fileUrlForChatUpload;
    link.download = this.uploadFileName; // Set the name of the file for download
    link.click(); // Programmatically trigger the download
  }
  downloadFileFromAdditional() {
    // Create an invisible download link and trigger the download
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
      if (obj[key] === 'NO INFORMATION PROVIDED') {
        obj[key] = this.ADAtext;
      }
      if (obj.hasOwnProperty(key)) {
        // this wil format the values of keys
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

    if (value == 'Yes, everything looks good') {
      this.chatHistory.push({ text: value, sender: 'user', isFile: false });
      this.loader = true;
      this.dataa = {
        session_id: this.sessionId,
        user_name: this.api.userName,
        user_message: value,
        edit_field: '',
        confirmation: 'False',
      };
      this.api.sendData(this.dataa).subscribe({
        next: (response) => {
          this.loader = false;
          this.allLooksGoodCliced = true;
          this.successDivText =
            'Successfully accepted the ADA-generated content';
          this.successDivCloseAfterSec();
          this.apiResponseData = response;
          if (this.apiResponseData) {
            if (this.apiResponseData.hasOwnProperty('BIC')) {
              this.bicFieldData = this.formatObjectKeys(
                this.apiResponseData.BIC
              );
            }
            if (this.apiResponseData.hasOwnProperty('bot_message')) {
              this.botChatMessage = this.apiResponseData.bot_message;
            }

            if (this.apiResponseData.hasOwnProperty('button')) {
              this.botButtonResponse = this.apiResponseData.button;
            }
            this.chatHistory.push({
              text: this.botChatMessage,
              sender: 'bot',
              button: this.botButtonResponse,
            });
            this.staticBotMsg = false;
            this.dataa.confirmation = 'False';
            this.fields = this.fields.map((field) => ({
              ...field,
              value: this.bicFieldData[field.label] || '',
            }));
            this.fields.forEach((field) => {
              if (field.value !== '' && field.value !== this.ADAtext) {
                field.completed = true;
              }
            });
            this.progressBarUpdate();
          }
        },
        error: (error) => {
          console.log('error', error);
        },
        complete: () => console.log('Completed'),
      });
    } else if (value == "No, I'd like to review and make edits") {
      this.chatHistory.push({ text: value, sender: 'user', isFile: false });
      this.loader = true;
      this.dataa = {
        session_id: this.sessionId,
        user_name: this.api.userName,
        user_message: value,
        edit_field: '',
        confirmation: 'False',
      };

      this.api.sendData(this.dataa).subscribe({
        next: (response) => {
          this.loader = false;
          this.apiResponseData = response;
          if (this.apiResponseData) {
            if (this.apiResponseData.hasOwnProperty('BIC')) {
              this.bicFieldData = this.formatObjectKeys(
                this.apiResponseData.BIC
              );
            }
            if (this.apiResponseData.hasOwnProperty('bot_message')) {
              this.botChatMessage = this.apiResponseData.bot_message;
            }

            if (this.apiResponseData.hasOwnProperty('button')) {
              this.botButtonResponse = this.apiResponseData.button;
            }
            this.staticBotMsg = false;
            this.dataa.confirmation = 'False';
            this.chatHistory.push({
              text: this.botChatMessage,
              sender: 'bot',
              button: this.botButtonResponse,
            });
          }
        },
        error: (error) => {
          console.log('error', error);
        },
        complete: () => console.log('Completed'),
      });

      this.fields.forEach((field) => {
        if (field.value !== '' && field.value !== this.ADAtext) {
          field.completed = true;
        }
      });
    } else {
      this.editFieldVal = value;

      this.chatHistory.push({ text: value, sender: 'user', isFile: false });
      this.loader = true;
      this.dataa = {
        session_id: this.sessionId,
        user_name: this.api.userName,
        user_message: '',
        edit_field: value,
        confirmation: 'False',
      };

      this.api.sendData(this.dataa).subscribe({
        next: (response) => {
          this.loader = false;
          this.apiResponseData = response;
          if (this.apiResponseData) {
            if (this.apiResponseData.hasOwnProperty('BIC')) {
              this.bicFieldData = this.formatObjectKeys(
                this.apiResponseData.BIC
              );
            }
            if (this.apiResponseData.hasOwnProperty('bot_message')) {
              this.botChatMessage = this.apiResponseData.bot_message;
            }

            if (this.apiResponseData.hasOwnProperty('button')) {
              this.botButtonResponse = this.apiResponseData.button;
            }
            if (typeof this.botChatMessage !== 'string') {
              if (
                this.botButtonResponse.length > 0 &&
                this.apiResponseData.drop_down == true
              ) {
                this.chatHistory.push({
                  text: {
                    question: this.botChatMessage['Question'],
                    guidelines: this.splitByDot(
                      this.botChatMessage['Guidelines']
                    ),
                  },
                  dropdown: this.botButtonResponse,
                  sender: 'bot',
                  fieldName: value,
                });
              } else if (
                this.botButtonResponse.length > 0 &&
                this.apiResponseData.drop_down == false
              ) {
                this.chatHistory.push({
                  text: {
                    question: this.botChatMessage['Question'],
                    guidelines: this.splitByDot(
                      this.botChatMessage['Guidelines']
                    ),
                  },
                  mappingButton: this.botButtonResponse,
                  sender: 'bot',
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
                  sender: 'bot',
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
        error: (error) => {
          console.log('error', error);
        },
        complete: () => console.log('Completed'),
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
      sender: 'user',
      isFile: false,
    });
    this.loader = true;
    this.dataa.edit_field = this.editFieldVal;
    this.dataa.user_message = `${this.bussinessDropDownKey}, ${this.bussinessUserInputForMappingButtons}`;
    this.dataa.confirmation = 'True';
    this.staticBotMsg = true;
    this.api.sendData(this.dataa).subscribe({
      next: (response) => {
        this.loader = false;
        this.apiResponseData = response;
        if (this.apiResponseData) {
          if (this.apiResponseData.hasOwnProperty('BIC')) {
            this.bicFieldData = this.formatObjectKeys(this.apiResponseData.BIC);
          }
          if (this.apiResponseData.hasOwnProperty('bot_message')) {
            this.botChatMessage = this.apiResponseData.bot_message;
          }

          if (this.apiResponseData.hasOwnProperty('button')) {
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
      error: (error) => {
        console.log('error', error);
      },
      complete: () => console.log('Completed'),
    });
  }

  itMappingButtonClicked(value: any) {
    this.itMappingButtonClicke = true;
    this.itDropDownKey = value;
  }

  itConfirmButton() {
    this.chatHistory.push({
      text: `${this.itDropDownKey}, ${this.itUserInputForMappingButtons}`,
      sender: 'user',
      isFile: false,
    });
    this.loader = true;
    this.dataa.edit_field = this.editFieldVal;
    this.dataa.user_message = `${this.itDropDownKey}, ${this.itUserInputForMappingButtons}`;
    this.dataa.confirmation = 'True';
    this.staticBotMsg = true;
    this.api.sendData(this.dataa).subscribe({
      next: (response) => {
        this.loader = false;
        this.apiResponseData = response;
        if (this.apiResponseData) {
          if (this.apiResponseData.hasOwnProperty('BIC')) {
            this.bicFieldData = this.formatObjectKeys(this.apiResponseData.BIC);
          }
          if (this.apiResponseData.hasOwnProperty('bot_message')) {
            this.botChatMessage = this.apiResponseData.bot_message;
          }

          if (this.apiResponseData.hasOwnProperty('button')) {
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
      error: (error) => {
        console.log('error', error);
      },
      complete: () => console.log('Completed'),
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

    for (let field of first10Fields) {
      if (
        field.value == '' ||
        field.value ==
          "ADA couldn't fill this field, please continue the conversation to fill it"
      ) {
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
    this.successDivText = 'Successfully accepted the ADA-generated content';
    this.successDivCloseAfterSec();
    this.fields[indexVal].completed = true;
  }

  editButton(indexVal: any) {
    this.userInput = this.fields[indexVal].value;
    this.dataa.edit_field = this.fields[indexVal].label;
    this.dataa.confirmation = 'False';
    this.editButtonClicked = true;
    setTimeout(() => {
      const textArea = this.textarea.nativeElement;
      textArea.style.height = 'auto'; // Reset height
      textArea.style.height = `${textArea.scrollHeight}px`; // Recalculate after update
    }, 0);
  }

  AllGoodButton() {
    this.allLooksGoodCliced = true;
    this.chatHistory.push({
      text: 'All details looks good to me',
      sender: 'user',
      isFile: false,
    });
    this.chatHistory.push({
      text: this.botChatMessage,
      sender: 'bot',
      button: this.botButtonResponse,
    });
    this.fields.forEach((field) => {
      if (field.value !== '' && field.value !== this.ADAtext) {
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
      sender: 'user',
      isFile: false,
    });
    this.loader = true;
    this.dataa = {
      session_id: this.sessionId,
      user_name: this.api.userName,
      user_message: '',
      edit_field: this.fields[indexVal].label,
      confirmation: 'False',
    };
    this.api.sendData(this.dataa).subscribe({
      next: (response) => {
        this.loader = false;
        this.apiResponseData = response;
        if (this.apiResponseData) {
          if (this.apiResponseData.hasOwnProperty('BIC')) {
            this.bicFieldData = this.formatObjectKeys(this.apiResponseData.BIC);
          }
          if (this.apiResponseData.hasOwnProperty('bot_message')) {
            this.botChatMessage = this.apiResponseData.bot_message;
          }

          if (this.apiResponseData.hasOwnProperty('button')) {
            this.botButtonResponse = this.apiResponseData.button;
          }
          if (typeof this.botChatMessage !== 'string') {
            if (this.botButtonResponse !== null) {
              if (
                this.botButtonResponse.length > 0 &&
                this.apiResponseData.drop_down == true
              ) {
                this.chatHistory.push({
                  text: {
                    question: this.botChatMessage['Question'],
                    guidelines: this.splitByDot(
                      this.botChatMessage['Guidelines']
                    ),
                  },
                  dropdown: this.botButtonResponse,
                  sender: 'bot',
                  fieldName: this.fields[indexVal].label,
                });
              } else if (
                this.botButtonResponse.length > 0 &&
                this.apiResponseData.drop_down == false
              ) {
                if (this.checkIfArray(this.botChatMessage['Guidelines'])) {
                  this.chatHistory.push({
                    text: {
                      question: this.botChatMessage['Question'],
                      guidelines: this.splitByDot(
                        this.botChatMessage['Guidelines']
                      ),
                    },
                    mappingButton: this.botButtonResponse,
                    sender: 'bot',
                    fieldName: this.fields[indexVal].label,
                  });
                } else {
                  this.chatHistory.push({
                    text: {
                      question: this.botChatMessage['Question'],
                      guidelines: this.splitByDot(
                        this.botChatMessage['Guidelines']
                      ),
                    },
                    button: this.botButtonResponse,
                    sender: 'bot',
                  });
                }
              } else {
                this.chatHistory.push({
                  text: {
                    question: this.botChatMessage['Question'],
                    guidelines: this.splitByDot(
                      this.botChatMessage['Guidelines']
                    ),
                  },
                  sender: 'bot',
                });
              }
            } else {
              this.chatHistory.push({
                text: {
                  question: this.botChatMessage['Question'],
                  guidelines: this.splitByDot(
                    this.botChatMessage['Guidelines']
                  ),
                },
                sender: 'bot',
              });
            }
          }
          this.staticBotMsg = false;
          this.dataa.confirmation = 'False';

          this.fields = this.fields.map((field) => ({
            ...field,
            value: this.bicFieldData[field.label] || '', // Use mock data or default value
          }));

          this.progressBarUpdate();
          setTimeout(() => {
            this.initializeTooltips();
          });
        }
      },
      error: (error) => {
        console.log('error', error);
      },
      complete: () => console.log('Completed'),
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        return; // Do nothing to let the new line be created
      } else {
        // Enter pressed without Shift: Send the message
        event.preventDefault(); // Prevent default Enter behavior (new line)
        this.handleUserInput(this.userInput); // Call your send message function
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
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
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
    let chatData = {
      chatHistory: this.chatHistory,
      formFieldValue: this.fields,
      submit: true,
    };
    let data = {
      session_id: this.sessionId,
      user_name: this.api.userName,
      session_data: chatData,
    };

    this.api.submitData(data).subscribe({
      next: (response) => {
        this.additionalDataForSubmit();
      },
      error: (error) => {
        console.log('error', error);
      },
      complete: () => console.log('Completed'),
    });
  }

  submitButton() {
    if (!this.allLooksGoodCliced) {
      const modalElement = document.getElementById(
        'reviewModal'
      ) as HTMLElement;
      if (modalElement) {
        const myModal = new bootstrap.Modal(modalElement);
        myModal.show();
        return;
      } else {
      }
    } else {
      this.submitButtonPopup();
    }
  }

  showmodal() {
    const modalElement = document.getElementById('reviewModal') as HTMLElement;
    if (modalElement) {
      const myModal = new bootstrap.Modal(modalElement);
      myModal.show(); // Show the modal correctly
      // Log to check if it's being triggered
    }
  }

  additionalDataForSubmit() {
    let filled = this.fields.filter(
      (field) => field.value.trim() !== '' && field.value !== this.ADAtext
    ).length;
    let additionalData = {
      user_name: this.api.userName,
      session_id: this.sessionId,
      update_data: {
        Additional_Comments: '',
        Additional_Files: '',
        Total_no_of_questions_completed: filled.toString(),
        Submitted_date: this.datePipe.transform(
          new Date(),
          'dd-MM-yyyy HH:mm:ss'
        ),
        Status: 'Pending-review',
      },
    };
    if (this.fileUploadFromAttachment) {
      additionalData.update_data.Additional_Files =
        this.fileUploadFromAttachment;
    }
    this.api.submitAdditionalData(additionalData).subscribe({
      next: (response) => {
        this.router.navigate(['/request']);
        setTimeout(() => {
          this.initializeTooltips();
        });
      },
      error: (error) => {
        console.log('error', error);
      },
      complete: () => console.log('Completed'),
    });
  }

  saveChatData() {
    let chatData = {
      chatHistory: this.chatHistory,
      formFieldValue: this.fields,
      submit: false,
    };
    let data = {
      session_id: this.sessionId,
      user_name: this.api.userName,
      session_data: chatData,
    };

    this.api.submitData(data).subscribe({
      next: (response) => {
        const data = { user_name: this.api.userName }; // Data to pass to the API
        this.api.retriveData(data);
        setTimeout(() => {
          this.initializeTooltips();
        });
      },
      error: (error) => {
        console.log('error', error);
      },
      complete: () => console.log('Completed'),
    });
  }

  onConfirmAreas() {
    this.confirmBtnOfAreaClk = true;
    const selected = this.botButtonResponse.filter(
      (area: any, i: any) => this.selectedAreas[i]
    );
    this.chatHistory.push({
      text: this.getSelectedRegions(),
      sender: 'user',
      isFile: false,
    });
    this.loader = true;
    this.dataa.edit_field = this.editFieldVal;
    this.dataa.confirmation = 'True';
    this.staticBotMsg = true;
    this.responseDataMethod(this.getSelectedRegions());
  }

  onConfirmDestination() {
    this.confirmBtnOfDestClk = true;
    const selected = this.botButtonResponse.filter(
      (area: any, i: any) => this.selectedDestination[i]
    );
    this.chatHistory.push({
      text: this.getSelectedDestination(),
      sender: 'user',
      isFile: false,
    });
    this.loader = true;
    this.dataa.edit_field = this.editFieldVal;
    this.dataa.confirmation = 'True';
    this.staticBotMsg = true;
    this.responseDataMethod(this.getSelectedDestination());
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
        if (instance) instance.dispose(); // Clean up old instance
        new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }, 0);
  }

  checkIfArray(value: any): boolean {
    return Array.isArray(value);
  }

  ngOnDestroy() {
    if (this.submitButtonClicked == true) {
      this.submitButtonClicked = false;
    } else {
      if (this.botRespondedFirstTime == true) {
        this.saveChatData();
        this.api.triggerAction('The BIC should saved as a draft');
      }
    }
  }
}
