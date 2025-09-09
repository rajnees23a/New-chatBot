import { Component, NgZone, ElementRef, Renderer2, ViewChild, OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import {SerrviceService} from '../serrvice.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as bootstrap from 'bootstrap';



@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnDestroy {

  constructor(private api: SerrviceService, private ngZone: NgZone, private datePipe: DatePipe, private route: ActivatedRoute,
    private router: Router
  ) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: any) => {
      this.ngZone.run(() => {
        this.userInput = event.results[0][0].transcript;
      });
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }
  isActive = false;
  createNew: boolean = true;
  botMultiQuestion: boolean =  false;
  isListening = false;
  recognition: any;
  receivedValue: boolean | null = null;
  isCollapsed = false;
  @ViewChild('reviewModal') reviewModal!: ElementRef;
  data = {
    session_id: "1234abcd",
    botmessage: "Let’s start by understanding your idea. Give me a brief overview, covering the key challenge and what you want to achieve",
    fieldText : "Problem Statement",
    fieldValue : "",
    fieldStatus : false,
    guieText : ["What’s the problem? (What needs fixing or improving?)","What’s your goal? (What do you want to achieve?)",
      "How will success be measured? (Think metrics or key results.)","Is there urgency? (Any deadlines, priorities, or risks?)"
    ],
    following : ["Text input (Type your response)","Attachment (Upload a PDF, Word, PPT or Excel file)",
      "Voice input (Record your response)"
    ]
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
  errorDivText = "";
  successDivVisible = false;
  successDivText = "";
  fileUploadFromChatBot: any;
  allLooksGoodCliced: boolean = false;


  // chatHistory: { text: any, sender: string}[] = [];
  userInput: string = '';
  chatHistory: any[] = [];
  fields = [
    { label: 'Your idea title', value: '', valid: false, editing: false, answer: 'This is my idea', image: "assets/images/title.svg", completed:false },
    { label: 'Problem statement', value: '', valid: false, editing: false, answer: 'This is my problem', image: "assets/images/problem-statement.svg", completed:false },
    { label: 'Objective', value: '', valid: false, editing: false, answer: 'This is my objective', image: "assets/images/objective.svg", completed:false  },
    { label: 'Key results', value: '', valid: false, editing: false, answer: 'This is my key', image: "assets/images/key-result.svg", completed:false  },
    { label: 'Key features', value: '', valid: false, editing: false, answer: 'This is my key', image: "assets/images/key-feature.svg", completed:false  },
    { label: 'Urgency', value: '', valid: false, editing: false, answer: 'This is my urgency', image: "assets/images/urgency.svg", completed:false  },
    { label: 'Areas involved', value: '', valid: false, editing: false, answer: 'This is my areas', image: "assets/images/area-involved.svg", completed:false  },
    { label: 'Destination 2027 alignment', value: '', valid: false, editing: false, answer: 'This is my Idea', image: "assets/images/destination.svg" },
    { label: 'Risks', value: '', valid: false, editing: false, answer: 'This is my Idea', image: "assets/images/risk.svg" },
    { label: 'KPIs', value: '', valid: false, editing: false, answer: 'This is my idea', image: "assets/images/key-result.svg", completed:false },
    { label: 'Data needed', value: '', valid: false, editing: false, answer: 'This is my problem', image: "assets/images/data-needed.svg", completed:false },
    { label: 'Impact', value: '', valid: false, editing: false, answer: 'This is my objective', image: "assets/images/impact.svg", completed:false  },
    { label: 'Implementation considerations', value: '', valid: false, editing: false, answer: 'This is my key', image: "assets/images/implementation.svg", completed:false  },
    { label: 'Dependencies', value: '', valid: false, editing: false, answer: 'This is my urgency', image: "assets/images/dependencies.svg", completed:false  },
    { label: 'Key dates', value: '', valid: false, editing: false, answer: 'This is my areas', image: "assets/images/key-dates.svg", completed:false  },
    { label: 'Timelines', value: '', valid: false, editing: false, answer: 'This is my Idea', image: "assets/images/timeline.svg" },
    { label: 'Business sponsor', value: '', valid: false, editing: false, answer: 'This is my Idea', image: "assets/images/business-sponsor.svg" },
    { label: 'Budget details', value: '', valid: false, editing: false, answer: 'This is my Idea', image: "assets/images/budget-details.svg" },
    { label: 'Stakeholders', value: '', valid: false, editing: false, answer: 'This is my Idea', image: "assets/images/stakeholders.svg" },
    { label: 'Scope', value: '', valid: false, editing: false, answer: 'This is my Idea', image: "assets/images/scope.svg" },
    { label: 'Business case impacts', value: '', valid: false, editing: false, answer: 'This is my Idea', image: "assets/images/business-case-impact.svg" },
    { label: 'Portfolio alignment', value: '', valid: false, editing: false, answer: 'This is my Idea', image: "assets/images/portfolio-alignment.svg" },
    { label: 'IT sponsor', value: '', valid: false, editing: false, answer: 'This is my Idea', image: "assets/images/it-sponsor.svg" },
    { label: 'Additional attachments', value: '', valid: false, editing: false, answer: 'This is my Idea', image: "assets/images/additional-attachments.svg" },
    { label: 'Additional comments', value: '', valid: false, editing: false, answer: 'This is my Idea', image: "assets/images/additional-comments.svg" }
    
  ];
  bicFieldData : any;
  botChatMessage = "Hello";
  apiResponseData: any;
  progress = 0;
  loader = false;
  botButtonResponse: any;
  editFieldVal = ""
  buttonDisabled = true;
  editButtonClicked = false;
  sessionId = this.api.userName;
  userM = "I would like to develop a global process to enable users from HMS Host and Autogrill to access Avolta Insights, which currently is only available for Dufry users. This impacts approximatly 30% of all users from the whole company, and will help the business visualize critical data on key business initiatives"
  selectedOptionsofDropdown = "";
  ADAtext = "ADA couldn't fill this field, please continue the conversation to fill it";
  allFieldssLookGoodButton = true;
  showChatDelete = false;
  showAttachmentDelete = false;
  dataa = {session_id: this.sessionId,user_name:this.api.userName,user_message: this.userM, edit_field: ""};
  selectedIndexOfButton: number | null = null;
  submitButtonClicked = false;
  botRespondedFirstTime = false;
  comingFromCreate = "";
  selectedAreas: boolean[] = [];
  selectedDestination: boolean[] = [];


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if(id == 'create'){
        this.comingFromCreate = id
      }

      // console.log("query param home",id);
    });
    this.sessionId = this.generateSessionId();
    this.dataa.session_id = this.sessionId;
    this.chatHistory.push({ text: this.data.botmessage, sender: 'bot' });
    this.chatHistory.push({ text: { question: 'Let’s start with the basics! Share a brief description of your idea, covering', guidelines: this.data.guieText }, sender: 'bot' });
    this.chatHistory.push({ followingText: { question: 'You can provide your response in one of the following ways', hints: this.data.following }, sender: 'bot' });
    const textAreas = document.querySelectorAll('textarea');
    textAreas.forEach((element: HTMLTextAreaElement) => {
      // Set initial height based on scroll height
      element.style.height = `${element.scrollHeight}px`;

      // Listen to the input event to adjust the height dynamically
      element.addEventListener('input', (event: Event) => {
        const target = event.target as HTMLTextAreaElement;
        // Reset the height to 'auto' before setting the scrollHeight to ensure it shrinks properly
        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight}px`;
      });
    });


  window.onbeforeunload = (event) => {
    // this.saveChatData();
  };
  }



  handleUserInput(data: any) {
    if(this.selectedFile){
      console.log("selectedFile",this.selectedFile);
      this.uploadFileName = this.selectedFile.name
      this.fileUploadFromChatBot = this.selectedFile
      this.chatHistory.push({
        isFile: true,
        fileName: this.selectedFile.name,
        fileUrl: this.fileUrlForChatUpload,
        sender: 'user'
      });
      this.uploadFileFirstTime = true;
    }
    if(this.userInput){

      this.chatHistory.push({ text: this.userInput, sender: 'user', isFile: false});
    }
    if(this.dataa.edit_field !== "" && !this.editButtonClicked){
      this.dataa.user_message = data;
      this.dataa.edit_field = this.editFieldVal;
      this.staticBotMsg = true;
    }
    this.loader = true;
    this.responseDataMethod(data);
    this.userInput = '';
    this.editButtonClicked = false;
    this.selectedFile = null;
    this.resetTextAreaSize();

  }

  responseDataMethod(data: any){
    console.log("clicked", data);
    this.dataa.user_message = data;
    if(this.dataa.edit_field == ""){
      this.staticBotMsg = true;
    }
    
    this.api.sendData(this.dataa, this.selectedFile).subscribe( 
      response => {
        this.botRespondedFirstTime = true;
      console.log("response==============",this.chatHistory);
      this.loader = false;
      this.apiResponseData = response
      if(this.apiResponseData){
        if(this.apiResponseData.hasOwnProperty('BIC')){
          this.bicFieldData = this.formatObjectKeys(this.apiResponseData.BIC);
        }
        if(this.apiResponseData.hasOwnProperty('bot_message')){
          this.botChatMessage = this.apiResponseData.bot_message;
        }
        if(this.apiResponseData.hasOwnProperty('button')){
          this.botButtonResponse = this.apiResponseData.button;
        }
        this.processChatResponse(this.userInput);
      }
    },
      error => {
        console.log('error', error);
        console.log("response",this.chatHistory);
        this.loader = false;
        this.chatHistory.push({ text: "Sorry for trouble,there is some network issues please try again", sender: 'bot'});
      })
  }


    // This function is called when the user focuses on the textarea
    onFocus(): void {
      const div1 =  document.getElementById('textArDiv');
      const div3 =  document.getElementById('textAbut');
      if(div1){
        div1.classList.add('active');
      }
      if(div3){
        div3.classList.add('primaryeffect');
      }
      
    

    // Get the textarea and button elements
// let textarea = document.getElementById('textAFie');
// const sendButton = document.getElementById('textAbut');

// Enable the send button when the user clicks or types in the textarea
// textarea.addEventListener('focus', this.toggleeButton);
// textarea.addEventListener('input', this.toggleeButton);


    }

  toggleeButton() {
      // Enable the button if the textarea is not empty
      // if (textarea.value.trim() !== '') {
          // sendButton.disabled = false;
      // } else {
          // sendButton.disabled = true;]
      // }
  }

    onBlur(){
      const div1 =  document.getElementById('textArDiv');
      const div3 =  document.getElementById('textAbut');
      if(div1){
        div1.classList.remove('active');
      }
      if(div3 && this.userInput !== ""){
        div3.classList.remove('primaryeffect');
      }
    }
   
    // This function is called on every input in the textarea
    onInput(): void {
      // You could do any additional logic based on input if necessary
      const div3 =  document.getElementById('textAbut');
      if(div3){
        div3.classList.add('primaryeffect');
      }
    }

  resetTextAreaSize(): void {
    const textAreas = document.querySelectorAll('textarea');
    textAreas.forEach((element: HTMLTextAreaElement) => {
      // Reset the height of all textareas
      element.style.height = 'auto';
      // element.style.height = `${element.scrollHeight}px`;
    });
  }

  

  toggleButton(){
    const div1 =  document.getElementById('rowBox');
    const div2 =  document.getElementById('rightBox');
    if(div1 && div2){
      this.isActive = !this.isActive;
      if(this.isActive){
        div1.classList.add('fieldresize');
      }else {
        div1.classList.remove('fieldresize');
      }
    }
  }

  

  isString(value: any): boolean {
    // console.log("ddddddd",typeof value)
    return typeof value === 'string';
  }

  processChatResponse(input: string) {

    // for (let i = 0; i < this.fields.length; i++) {
    //   if (!this.fields[i].value) {
    //     this.fields[i].valid = this.validateResponse(input, i);
    //     if(this.fields[i].valid == false) {
    //       this.chatHistory.push({ text: "Invalid response. Please try again.", sender: 'bot' });
    //       break;
    //     }
    //     this.fields[i].value = input;
    //     let filled = this.fields.filter(field => field.value.trim() !== '').length
    //     this.progress = Math.round((filled/ this.fields.length) * 100);
    //     this.askNextQuestion(i + 1);
    //     break;
    //   }
    // } 
    this.allFieldssLookGoodButton = false;
    if(this.staticBotMsg == true){
      this.chatHistory.push({ text: "This is your Business Idea Canvas! Based on what you shared, I’ve prefilled the key fields based on your input. Please review them on the right panel and confirm if everything looks good", sender: 'bot', button: ["Yes, everything looks good","No I'd like to review and make edits"]});
    }else{
      this.chatHistory.push({ text: this.botChatMessage, sender: 'bot'});
    }
    
    this.fields = this.fields.map(field => ({
      ...field,
      value: this.bicFieldData[field.label] || '' // Use mock data or default value
    }));
    if(this.uploadFileName){
      this.fields[23].value = this.uploadFileName
    }
    let filled = this.fields.filter(field => (field.value.trim() !== '' && field.value !== this.ADAtext)).length
    this.progress = Math.round((filled/ this.fields.length) * 100);
    this.checkFirst10Completed();
  }

  dropDownSel(){
    console.log("drop",this.selectedOptionsofDropdown);
    this.userInput = this.selectedOptionsofDropdown[0];
    console.log("userInput",this.userInput);
    this.dataa.edit_field = this.editFieldVal; 
  }

  startListening() {
    console.log("listen",this.isListening);
    
    if (!this.isListening) {
      this.isListening = true;
      this.recognition.start();
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    // Allowed file types
    const allowedExtensions = [".pdf", ".ppt", ".pptx", ".doc", ".docx", ".xls", ".xlsx"];
    const maxSize = 20 * 1024 * 1024; // 20 MB in bytes

    // Get file extension
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

    // Check file type
    if (!allowedExtensions.includes(fileExtension)) {
      this.errorDivText = "Files of following format is not supported" + " "+fileExtension;
      this.errorDivCloseAfterSec();
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      this.errorDivText = "You may not upload files larger than 20mb"
      this.errorDivCloseAfterSec();
      return;
    }
     // For now, set a default file icon based on extension
     if (fileExtension === '.doc' || fileExtension === '.docx') {
       this.fileIcon = 'path_to_doc_icon.png'; // Replace with actual icon path
     } else if (fileExtension === '.ppt' || fileExtension === '.pptx') {
       this.fileIcon = 'path_to_ppt_icon.png'; // Replace with actual icon path
     } else if (fileExtension === '.pdf') {
       this.fileIcon = "assets/images/download.png"; // Replace with actual icon path
     } else {
       this.fileIcon = 'path_to_generic_icon.png'; // Replace with a default icon
     }
    // this.fileValidation(event)
    this.selectedFile = file;
    this.fileUrlForChatUpload = URL.createObjectURL(file);
  }

  fileValidation(event: any){
    const file: File = event.target.files[0];
    // Allowed file types
    const allowedExtensions = [".pdf", ".ppt", ".pptx", ".doc", ".docx", ".xls", ".xlsx"];
    const maxSize = 20 * 1024 * 1024; // 20 MB in bytes

    // Get file extension
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

    // Check file type
    if (!allowedExtensions.includes(fileExtension)) {
      this.errorDivText = "Files of following format is not supported" + " "+fileExtension;
      this.errorDivCloseAfterSec();
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      this.errorDivText = "You may not upload files larger than 20mb"
      this.errorDivCloseAfterSec();
      return;
    }
     // For now, set a default file icon based on extension
     if (fileExtension === '.doc' || fileExtension === '.docx') {
       this.fileIcon = 'path_to_doc_icon.png'; // Replace with actual icon path
     } else if (fileExtension === '.ppt' || fileExtension === '.pptx') {
       this.fileIcon = 'path_to_ppt_icon.png'; // Replace with actual icon path
     } else if (fileExtension === '.pdf') {
       this.fileIcon = "assets/images/download.png"; // Replace with actual icon path
     } else {
       this.fileIcon = 'path_to_generic_icon.png'; // Replace with a default icon
     }
  }

  onFileAttach(event: any){
    const file: File = event.target.files[0];
    // Allowed file types
    const allowedExtensions = [".pdf", ".ppt", ".pptx", ".doc", ".docx", ".xls", ".xlsx"];
    const maxSize = 20 * 1024 * 1024; // 20 MB in bytes

    // Get file extension
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

    // Check file type
    if (!allowedExtensions.includes(fileExtension)) {
      this.errorDivText = "Files of following format is not supported" + " "+fileExtension;
      this.errorDivCloseAfterSec();
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      this.errorDivText = "You may not upload files larger than 20mb"
      this.errorDivCloseAfterSec();
      return;
    }
     // For now, set a default file icon based on extension
     if (fileExtension === '.doc' || fileExtension === '.docx') {
       this.fileIcon = 'path_to_doc_icon.png'; // Replace with actual icon path
     } else if (fileExtension === '.ppt' || fileExtension === '.pptx') {
       this.fileIcon = 'path_to_ppt_icon.png'; // Replace with actual icon path
     } else if (fileExtension === '.pdf') {
       this.fileIcon = "assets/images/download.png"; // Replace with actual icon path
     } else {
       this.fileIcon = 'path_to_generic_icon.png'; // Replace with a default icon
     }
    // this.fileValidation(event)
    this.fileUploadFromAttachment = file;
    this.fileUrlForAttachmentUpload = URL.createObjectURL(file);
    this.uploadFileFirstTime = true;
    if(this.fileUploadFromAttachment){
      let dataa = {session_id: this.sessionId,user_name:this.api.userName};
      this.api.attachFile(dataa, this.fileUploadFromAttachment).subscribe( 
        response => {
        this.apiResponseData = response
        if(this.apiResponseData){
          this.successDivText = "Successfully attach the file"
          this.successDivCloseAfterSec();
        }
      },
        error => {
          this.errorDivText = "There is some error while uploading the file, please try again"
          this.errorDivCloseAfterSec();
        })
    }
  }

  deleteAttachment() {
    this.fileUploadFromAttachment = null
    this.fileIcon = ""
    this.successDivText = "Successfully delete the file"
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

  errorDivCloseAfterSec(){
    this.errorDivVisible = true;
      setTimeout(() => {
        this.errorDivVisible = false;
      }, 5000);
  }
  errorDivCloseInstant(){
    this.errorDivVisible = false;
  }
  successDivCloseAfterSec(){
    this.successDivVisible = true;
      setTimeout(() => {
        this.successDivVisible = false;
      }, 9000);
  }
  successDivCloseInstant(){
    this.successDivVisible = false;
  }

  removeFile() {
    this.selectedFile = null;
    this.fileIcon = '';
  }

  formatObjectKeys(obj: { [key: string]: string }): { [key: string]: string } {
    const formattedObj: { [key: string]: string } = {};
    for (const key in obj) {
      if (obj[key] === "NO INFORMATION PROVIDED") {
        obj[key] = this.ADAtext;
      }
      if (obj.hasOwnProperty(key)) {
        // const value = obj[key];  // this wil format the values of keys
        const words = key.split(' ');
        if (words.length > 1) {
          words[1] = words[1].toLowerCase();
        }
        formattedObj[words.join(' ')] = obj[key];
      }
    }
    return formattedObj;
  }

  yesNoButton(value: any, index?:any){
    
    this.selectedIndexOfButton = index;
    console.log("val",value);
    if(value == 'Yes, everything looks good'){
      this.allLooksGoodCliced = true;
      this.successDivText = "Successfully accepted the ADA-generated content"
      this.successDivCloseAfterSec();
      this.chatHistory.push({ text: value, sender: 'user', isFile: false});
        this.chatHistory.push({ text: this.botChatMessage, sender: 'bot', button: this.botButtonResponse});
        this.fields.forEach(field => {
          if (field.value !== '' && field.value !== this.ADAtext) {
            field.completed = true;
          }
        });      
    }else if (value == "No I'd like to review and make edits") {
      console.log("elseif");
    }else {
      this.editFieldVal = value;
      console.log("else");
      this.chatHistory.push({ text: value, sender: 'user', isFile: false});
      this.loader = true;
      // this.chatHistory.push({ text: this.botChatMessage, sender: 'bot', button: this.botButtonResponse});
      // thisdata = {session_id: this.sessionId, user_name:this.api.userName, user_message: "", edit_field: value};
      this.dataa = {session_id: this.sessionId,user_name:this.api.userName,user_message: "", edit_field: value};
        // if(this.dataa.edit_field == ""){
        //   this.staticBotMsg = true;
        // }
        
        this.api.sendData(this.dataa).subscribe( 
          response => {
          console.log("editresponse",response);
          this.loader = false;
          this.apiResponseData = response
          if(this.apiResponseData){
            if(this.apiResponseData.hasOwnProperty('BIC')){
              this.bicFieldData = this.formatObjectKeys(this.apiResponseData.BIC);
            }
            if(this.apiResponseData.hasOwnProperty('bot_message')){
              this.botChatMessage = this.apiResponseData.bot_message;
              console.log("fdgfgfhfhgfhfg",typeof this.botChatMessage);
              
              
            }
            
            if(this.apiResponseData.hasOwnProperty('button')){
              this.botButtonResponse = this.apiResponseData.button;
            }
            if (typeof this.botChatMessage !== "string") {
              if(this.botButtonResponse.length > 0 && this.apiResponseData.drop_down == true){
                this.chatHistory.push({ text: {question: this.botChatMessage['Question'],guidelines: this.splitByDot(this.botChatMessage['Guidelines'])}, dropdown :this.botButtonResponse,  sender: 'bot', fieldName: value});
              }else {

                this.chatHistory.push({ text: {question: this.botChatMessage['Question'],guidelines: this.splitByDot(this.botChatMessage['Guidelines'])}, sender: 'bot'});
              }
            }
            this.staticBotMsg = false;
              // this.chatHistory.push({ text: this.botChatMessage, sender: 'bot'});
            this.fields = this.fields.map(field => ({
              ...field,
              value: this.bicFieldData[field.label] || '' // Use mock data or default value
            }));
            let filled = this.fields.filter(field => (field.value.trim() !== '' && field.value !== this.ADAtext)).length
            this.progress = Math.round((filled/ this.fields.length) * 100);
          }
        },
          error => {
            console.log('error', error);
          })
      
    }
    this.checkFirst10Completed();
  }

  // validateResponse(input: string, index: number): boolean {
  //   if(input !== this.fields[index].answer) {

  //     return false;
  //   } else {
  //     return true;
  //   }
  // }



  handleBooleanValue(value: boolean) {
    this.receivedValue = value; 
    console.log('Received Value:', value);
    this.createNew = this.receivedValue;
  }

 splitByDot(str: string) {
    return str.split('.').map((item: string) => item.trim()).filter((item: string) => item !== '');
  }

  validateField(field: any) {
    field.valid = field.value.length > 5;
  }

    checkFirst10Completed() {

      const first10Fields = this.fields.slice(0, 9);  // Get first 10 elements
      console.log("10fields", first10Fields);
      
  
      let allCompleted = true;
   
      for (let field of first10Fields) {
        if(field.value == "" ||  field.value == "ADA couldn't fill this field, please continue the conversation to fill it"){
          allCompleted = false;
          break;
        }
  
        // if (!field.completed) {
  
        //   allCompleted = false;
  
        //   break;  // Exit the loop early if any field is not completed
  
        // }
  
      }
   
      if (allCompleted) {
  
        console.log('All first 10 items have completed: true');
        this.buttonDisabled = false;
  
      } else {
  
        console.log('Not all first 10 items have completed: true');
        this.buttonDisabled = true;
  
      }
    }  
  

  editField(field: any) {
    field.editing = true;
  }

  checkButton(indexVal: any) {
    this.successDivText = "Successfully accepted the ADA-generated content"
      this.successDivCloseAfterSec();
    this.fields[indexVal].completed = true;
  }

  editButton(indexVal: any) {
    this.userInput = this.fields[indexVal].value;
    this.dataa.edit_field = this.fields[indexVal].label;
    this.editButtonClicked = true;
  }

  AllGoodButton() {
    this.allLooksGoodCliced = true;    
    this.chatHistory.push({ text: 'All details looks good to me', sender: 'user', isFile: false});
      this.chatHistory.push({ text: this.botChatMessage, sender: 'bot', button: this.botButtonResponse});
      this.fields.forEach(field => {
        if (field.value !== '' && field.value !== this.ADAtext) {
          field.completed = true;
        }
      });   
    this.checkFirst10Completed();   
  }

  showAttachmentDeleteMethod(){
    this.showAttachmentDelete = !this.showAttachmentDelete;
  }
  showChatDeleteMethod(){
    this.showChatDelete = !this.showChatDelete;
  }
  addButton(indexVal: any){
    this.editFieldVal = this.fields[indexVal].label;;
    this.chatHistory.push({ text: this.fields[indexVal].label, sender: 'user', isFile: false});
    this.loader = true;
    this.dataa = {session_id: this.sessionId,user_name:this.api.userName,user_message: "", edit_field: this.fields[indexVal].label};      
      this.api.sendData(this.dataa).subscribe( 
        response => {
        console.log("editresponse",response);
        this.loader = false;
        this.apiResponseData = response
        if(this.apiResponseData){
          if(this.apiResponseData.hasOwnProperty('BIC')){
            this.bicFieldData = this.formatObjectKeys(this.apiResponseData.BIC);
          }
          if(this.apiResponseData.hasOwnProperty('bot_message')){
            this.botChatMessage = this.apiResponseData.bot_message;
            console.log("fdgfgfhfhgfhfg",typeof this.botChatMessage);
            
            
          }
          
          if(this.apiResponseData.hasOwnProperty('button')){
            this.botButtonResponse = this.apiResponseData.button;
          }
          if (typeof this.botChatMessage !== "string") {
            if(this.botButtonResponse.length > 0 && this.apiResponseData.drop_down == true){
              this.chatHistory.push({ text: {question: this.botChatMessage['Question'],guidelines: this.splitByDot(this.botChatMessage['Guidelines'])}, dropdown :this.botButtonResponse,  sender: 'bot', fieldName: this.fields[indexVal].label});
            }else {

              this.chatHistory.push({ text: {question: this.botChatMessage['Question'],guidelines: this.splitByDot(this.botChatMessage['Guidelines'])}, sender: 'bot'});
            }
          }
          this.staticBotMsg = false;
            // this.chatHistory.push({ text: this.botChatMessage, sender: 'bot'});
          this.fields = this.fields.map(field => ({
            ...field,
            value: this.bicFieldData[field.label] || '' // Use mock data or default value
          }));
          let filled = this.fields.filter(field => (field.value.trim() !== '' && field.value !== this.ADAtext)).length
          this.progress = Math.round((filled/ this.fields.length) * 100);
        }
      },
        error => {
          console.log('error', error);
        })
    
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        // Shift + Enter pressed: Insert a new line
        return; // Do nothing to let the new line be created
      } else {
        // Enter pressed without Shift: Send the message
        event.preventDefault();  // Prevent default Enter behavior (new line)
        this.handleUserInput(this.userInput);       // Call your send message function
      }
    }
  }

   // Function to generate a unique session ID
   generateSessionId(): string {
    return this.generateRandomString(8) + '-' + this.generateRandomString(4) + '-' + this.generateRandomString(4) + '-' + 
           this.generateRandomString(4) + '-' + this.generateRandomString(12) + this.generateRandomString(1);
  }

  // Helper function to generate a random alphanumeric string of a given length
  generateRandomString(length: number): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  submitButtonPopup(){
    this.submitButtonClicked = true;
    let chatData = {
      chatHistory: this.chatHistory,
      formFieldValue: this.fields,
      submit: true
    }
    let data = {
      session_id: this.sessionId,
      user_name: this.api.userName,
      session_data: chatData
    }
    console.log("Sumbit data", data);

    this.api.submitData(data).subscribe(
      response => {
        console.log("Submit Button response", response);
      },
      error => {
        console.log('error', error);

    })
    this.additionalDataForSubmit();
    this.router.navigate(['/request'])
  }
  
  submitButton() {
    if (!this.allLooksGoodCliced) {
      const modalElement = document.getElementById('reviewModal') as HTMLElement;
      if (modalElement) {
        const myModal = new bootstrap.Modal(modalElement);
        myModal.show();
        return
      } else {
        
      }
    }else {
      this.submitButtonPopup();
    }
  }


  showmodal() {
    const modalElement = document.getElementById('reviewModal') as HTMLElement;
    if (modalElement) {
      const myModal = new bootstrap.Modal(modalElement);
      myModal.show(); // Show the modal correctly
      console.log("modalShow======", myModal.show()); // Log to check if it's being triggered
    }
  }

  additionalDataForSubmit(){
    let filled = this.fields.filter(field => (field.value.trim() !== '' && field.value !== this.ADAtext)).length
    let additionalData = { 
      user_name: this.api.userName,
      session_id: this.sessionId,
      update_data : {
        Additional_Comments: "",
        Additional_Files: "",
        Total_no_of_questions_completed: filled.toString(),
        Submitted_date: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        Status: "Pending-review",
        }
    }
      if (this.fileUploadFromAttachment){
        additionalData.update_data.Additional_Files = this.fileUploadFromAttachment
      }
      this.api.submitAdditionalData(additionalData).subscribe(
        response => {
          console.log("additionalData  response", response);
        },
        error => {
          console.log('error', error);
  
      })
  }

  saveChatData() {
    let chatData = {
      chatHistory: this.chatHistory,
      formFieldValue: this.fields,
      submit: false
    }
    let data = {
      session_id: this.sessionId,
      user_name: this.api.userName,
      session_data: chatData
    }
    console.log("Sumbit data", data);

    this.api.submitData(data).subscribe(
      response => {
        console.log("Submit Button response", response);
        const data = { user_name: this.api.userName };  // Data to pass to the API
        this.api.retriveData(data);
      },
      error => {
        console.log('error', error);

      })
  }

  onConfirmAreas() {
    const selected = this.botButtonResponse.filter((area:any, i:any) => this.selectedAreas[i]);
    this.chatHistory.push({ text: this.getSelectedRegions(), sender: 'user', isFile: false});
    this.loader = true;
    this.dataa.edit_field = this.editFieldVal;
    this.staticBotMsg = true;
    this.responseDataMethod(this.getSelectedRegions());
  }

  onConfirmDestination() {
    const selected = this.botButtonResponse.filter((area:any, i:any) => this.selectedDestination[i]);
    this.chatHistory.push({ text: this.getSelectedDestination(), sender: 'user', isFile: false});
    this.loader = true;
    this.dataa.edit_field = this.editFieldVal;
    this.staticBotMsg = true;
    this.responseDataMethod(this.getSelectedDestination());
  }

  getSelectedRegions() {
    return this.botButtonResponse.filter((area:any, i:any) => this.selectedAreas[i]).join(', ');
  }
  getSelectedDestination() {
    return this.botButtonResponse.filter((area:any, i:any) => this.selectedDestination[i]).join(', ');
  }

  ngOnDestroy() {
    if(this.submitButtonClicked == true){
      this.submitButtonClicked = false;
    }else {
      if(this.botRespondedFirstTime == true){

        this.saveChatData();
      }
    }
  }
}
