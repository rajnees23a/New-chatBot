import { Field } from './field.model';

/**
 * Interface for mock field responses
 */
export interface MockFieldResponse {
  message: string;
  buttons?: string[];
  dropdown?: string[];
  mappingButton?: string[];
  fieldName?: string;
}

/**
 * Mock responses for specific field editing scenarios
 */
export class CreateComponentMockData {
  
  /**
   * Generate mock bot response based on the field being edited
   * @param currentField - The field label being edited
   * @returns MockFieldResponse object with appropriate response data
   */
  static generateFieldResponse(currentField: string): MockFieldResponse {
    switch (currentField) {
      case 'Areas involved':
        return {
          message: "Great! Which areas of your organization will be involved in this project?",
          dropdown: ['Customer Service', 'IT Department', 'Marketing', 'Operations', 'Finance', 'Legal'],
          fieldName: 'Areas involved'
        };
        
      case 'Destination 2027 alignment':
        return {
          message: "How does this project align with your Destination 2027 strategic goals?",
          dropdown: ['Digital Transformation', 'Customer Experience Excellence', 'Operational Efficiency', 'Innovation Leadership'],
          fieldName: 'Destination 2027 alignment'
        };
        
      case 'Business sponsor':
        return {
          message: "Who will be the business sponsor for this project?",
          mappingButton: ['Customer Experience Director', 'Head of Retail Operations', 'VP of Customer Service'],
          fieldName: 'Business sponsor'
        };
        
      case 'IT sponsor':
        return {
          message: "Who will be the IT sponsor for this project?",
          mappingButton: ['Chief Technology Officer', 'IT Director', 'Head of Digital Innovation'],
          fieldName: 'IT sponsor'
        };
        
      default:
        return {
          message: `Thank you for providing details about ${currentField}. I've updated the form with your input. Is there anything else you'd like to modify or add?`,
          buttons: ['Yes, everything looks good', "No, I'd like to review and make edits"]
        };
    }
  }

  /**
   * General conversation responses for non-specific field interactions
   */
  static getGeneralResponses(): string[] {
    return [
      "That's excellent input! I'm updating your business idea canvas with this information. Let me ask you about...",
      "Perfect! I can see this is a well-thought-out initiative. Let me help you refine a few more details...",
      "Great details! I'm capturing all of this in your form. Would you like to review what we have so far?",
      "Wonderful! This information really helps shape your business case. Shall we continue with additional details?"
    ];
  }

  /**
   * Get a random general response
   */
  static getRandomGeneralResponse(): MockFieldResponse {
    const responses = this.getGeneralResponses();
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      buttons: ['Continue with more details', 'Review current progress', 'All looks good to me']
    };
  }
}

export const mockStaticText = {
  CREATE: {},
  langForChat: 'en-US',
  bot_default_message: 'Hello! How can I help you?',
  senderBot: 'bot',
  senderUser: 'user',
  guideQuestionTitle: 'Guide Question',
  bot_default_guideText: ['Please follow the guidelines.'],
  followingQuestionTitle: 'Next Steps',
  bot_default_following: ['Edit your answer', 'Attach a file', 'Use voice input'],
  notSupportedText: 'File type not supported:',
  fileSizeExceededText: 'File size exceeded',
  largerThan: 'File is too large',
  attachFile: 'File attached successfully',
  errorDiv: 'An error occurred',
  deleteFile: 'File deleted',
  successADAContent: 'All good!',
  noInformation: 'No information',
  ADA_STATIC_TEXT: 'Not filled yet',
  yesEverything: 'Yes, everything is correct',
  noCheck: 'No, I want to check',
  false: 'False',
  true: 'True',
  enter: 'Enter',
  statusPending: 'Pending',
  generatedText: 'Generated',
  draftSaved: 'Draft saved',
  guidanceText: 'Guidance',
  question: 'Question',
  guidelines: 'Guidelines',
  areaInvolvedText: 'Areas involved',
  destinationText: 'Destination 2027 alignment',
  bussinessImpactText: 'Business case impacts',
  businessSponsorText: 'Business sponsor',
  itSponsorText: 'IT sponsor',
  timelinesText: 'Timelines',
  portfolioText: 'Portfolio alignment',
  additionalText: 'Additional comments',
  yourIdeaTitle: 'Your Idea',
  Progress: 'Progress',
  complete: 'complete',
  required: 'Required',
  AllGoodButton: 'All Good',
  notFilled: 'Not filled yet',
  drag: 'Drag and drop',
  choose: 'Choose file',
  download: 'Download',
  delete: 'Delete',
  add: 'Add',
  finalContent: 'This is not final content',
  review: 'Review',
  reviewDetail: 'Please review your answers before submitting.',
  CANCEL: 'Cancel',
  edit: 'Edit',
  submit: 'Submit',
  goodToMe: 'Looks good to me!',
  additional: 'Additional information',
  confirmText: 'Confirm',
  sorryNetworkText: 'Sorry, network error.',
  char: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
};

export const mockFields: Field[] = [
  {
    label: 'Project Name',
    value: 'ChatBot Implementation',
    image: '../../assets/images/project.svg',
    tooltip: 'Enter the project name',
    completed: true,
    editing: false,
    valid: true,
  },
  {
    label: 'Areas involved',
    value: '',
    image: '../../assets/images/area.svg',
    tooltip: 'Select involved areas',
    completed: false,
    editing: false,
    valid: false,
  },
  {
    label: 'Destination 2027 alignment',
    value: '',
    image: '../../assets/images/destination.svg',
    tooltip: 'Select destination alignment',
    completed: false,
    editing: false,
    valid: false,
  },
  {
    label: 'Business case impacts',
    value: '',
    image: '../../assets/images/impact.svg',
    tooltip: 'Select business impacts',
    completed: false,
    editing: false,
    valid: false,
  },
  {
    label: 'Business sponsor',
    value: '',
    image: '../../assets/images/business-sponsor.svg',
    tooltip: 'Select business sponsor',
    completed: false,
    editing: false,
    valid: false,
  },
  {
    label: 'IT sponsor',
    value: '',
    image: '../../assets/images/it-sponsor.svg',
    tooltip: 'Select IT sponsor',
    completed: false,
    editing: false,
    valid: false,
  },
  {
    label: 'Timelines',
    value: '',
    image: '../../assets/images/timeline.svg',
    tooltip: 'Select timelines',
    completed: false,
    editing: false,
    valid: false,
  },
  {
    label: 'Portfolio alignment',
    value: '',
    image: '../../assets/images/portfolio.svg',
    tooltip: 'Select portfolio alignment',
    completed: false,
    editing: false,
    valid: false,
  },
  {
    label: 'Risk',
    value: '',
    image: '../../assets/images/risk.svg',
    tooltip: 'Describe risks',
    completed: false,
    editing: false,
    valid: false,
  },
  {
    label: 'Additional attachments',
    value: '',
    image: '../../assets/images/attachment.svg',
    tooltip: 'Attach additional files',
    completed: false,
    editing: false,
    valid: false,
  },
  {
    label: 'Additional comments',
    value: '',
    image: '../../assets/images/comments.svg',
    tooltip: 'Add any additional comments',
    completed: false,
    editing: false,
    valid: false,
  },
];

export const mockChatHistory = [
  {
    text: mockStaticText.bot_default_message,
    sender: mockStaticText.senderBot,
  },
  {
    text: {
      question: mockStaticText.guideQuestionTitle,
      guidelines: mockStaticText.bot_default_guideText, // Now an array
    },
    sender: mockStaticText.senderBot,
    staticBotMessage: true,
  },
  {
    followingText: {
      question: mockStaticText.followingQuestionTitle,
      hints: mockStaticText.bot_default_following,
    },
    sender: mockStaticText.senderBot,
  },
  {
    text: 'User reply message',
    sender: mockStaticText.senderUser,
    isFile: false,
  },
  {
    text: 'Another user reply',
    sender: mockStaticText.senderUser,
    isFile: false,
  },
  {
    text: 'Bot reply with buttons',
    sender: mockStaticText.senderBot,
    button: ['Yes', 'No'],
  },
  {
    text: 'Bot reply with mappingButton',
    sender: mockStaticText.senderBot,
    mappingButton: ['Sponsor A', 'Sponsor B'],
    fieldName: 'Business sponsor',
  },
  {
    text: {
      question: 'What is your area?',
      guidelines: ['Choose at least one area.'],
    },
    dropdown: ['Area 1', 'Area 2', 'Area 3'],
    sender: mockStaticText.senderBot,
    fieldName: 'Areas involved',
  },
  {
    text: 'User uploaded a file',
    sender: mockStaticText.senderUser,
    isFile: true,
    fileName: 'test.pdf',
    fileUrl: 'blob:http://localhost/test.pdf',
  },
];

export const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

export const mockComponentState = {
  staticText: mockStaticText,
  fields: mockFields,
  chatHistory: mockChatHistory,
  fileExtension: '.PDF',
  addfileExtension: '.PDF',
  isActive: false,
  createNew: true,
  botMultiQuestion: false,
  isListening: false,
  recognition: null,
  receivedValue: null,
  isCollapsed: false,
  tooltipInstance: undefined,
  staticBotMsg: false,
  selectedFile: mockFile,
  fileUploadFromAttachment: mockFile,
  fileIcon: 'assets/images/pdf-download.png',
  fileUrlForChatUpload: 'blob:http://localhost/test.pdf',
  fileUrlForAttachmentUpload: 'blob:http://localhost/test.pdf',
  uploadFileName: 'test.pdf',
  uploadFileFirstTime: true,
  errorDivVisible: false,
  errorDivText: '',
  successDivVisible: false,
  successDivText: '',
  fileUploadFromChatBot: mockFile,
  allLooksGoodCliced: false,
  userInput: 'Test input',
  bicFieldData: {},
  botChatMessage: 'Bot message',
  apiResponseData: {},
  progress: 50,
  loader: false,
  botButtonResponse: ['Yes', 'No'],
  editFieldVal: '',
  buttonDisabled: true,
  editButtonClicked: false,
  sessionId: 'mock-session-id',
  selectedOptionsofDropdown: '',
  allFieldssLookGoodButton: true,
  showChatDelete: false,
  showAttachmentDelete: false,
  dataa: { session_id: 'mock-session-id', user_name: 'mockUser', user_message: '', edit_field: '', confirmation: 'False' },
  selectedIndexOfButton: null,
  submitButtonClicked: false,
  botRespondedFirstTime: true,
  comingFromCreate: '',
  selectedAreas: [true, false, false],
  selectedDestination: [false, true, false],
  userComeFirstTime: false,
  bussinessMappingButtonClicke: false,
  bussinessUserInputForMappingButtons: '',
  itMappingButtonClicke: false,
  itUserInputForMappingButtons: '',
  bussinessDropDownKey: '',
  itDropDownKey: '',
  groupA: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  groupB: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  groupC: [19, 20, 21, 22, 23, 24, 25],
  progressPercentage: 50,
  confirmBtnOfAreaClk: false,
  confirmBtnOfDestClk: false,
  confirmBtnOfBussClk: false,
  selectedBussiness: [false, false, true],
};
