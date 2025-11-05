/**
 * Centralized Mock Data File
 * Contains all mock data, hardcoded text, and sample structures used across components
 */

// ===============================================
// INTERFACE DEFINITIONS
// ===============================================

export interface RequestData {
  SessionID: string;
  Username: string;
  Requestnumber: string;
  Ideatitle: string;
  Submitteddate: string;
  Lastupdated: string;
  Totalnoofquestionscompleted: number;
  Status: string;
}

export interface RequestDetails {
  Requestnumber: string;
  Ideatitle: string;
  Submitteddate: string;
  Lastupdated: string;
  Totalnoofquestionscompleted: number;
  Status: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string | any;
  isFile: boolean;
  staticBotMessage?: boolean;
  followingText?: boolean;
}

export interface FormField {
  label: string;
  value: string;
  valid: boolean;
  editing: boolean;
  image: string;
  completed: boolean;
  tooltip?: string;
}

export interface MockResponseStage {
  botMessage: string;
  formUpdates: { [key: string]: string };
  buttons?: string[];
  dropdown?: string[];
  mappingButton?: string[];
  fieldName?: string;
}

export interface ModifiedDraft {
  session_id: string;
  user_name: string;
  displayTitle: string;
  created_date: string;
  sessionDataDraft: {
    chatHistory: ChatMessage[];
    formFieldValue: FormField[];
  };
}

// ===============================================
// MOCK DATA CONSTANTS
// ===============================================

export const MOCK_DATA = {
  // ===============================================
  // REQUEST DATA - Used in user-request component
  // ===============================================
  REQUEST_LIST: [
    {
      SessionID: 'session_001',
      Username: 'john.doe',
      Requestnumber: 'REQ-2024-001',
      Ideatitle: 'AI-Powered Customer Service Chatbot',
      Submitteddate: '2024-10-15',
      Lastupdated: '2024-11-01',
      Totalnoofquestionscompleted: 18,
      Status: 'Pending_review'
    },
    {
      SessionID: 'session_002',
      Username: 'jane.smith',
      Requestnumber: 'REQ-2024-002',
      Ideatitle: 'Digital Receipt Management System',
      Submitteddate: '2024-10-20',
      Lastupdated: '2024-11-02',
      Totalnoofquestionscompleted: 25,
      Status: 'Approved'
    },
    {
      SessionID: 'session_003',
      Username: 'mike.johnson',
      Requestnumber: 'REQ-2024-003',
      Ideatitle: 'Mobile App for Store Locator',
      Submitteddate: '2024-10-25',
      Lastupdated: '2024-11-03',
      Totalnoofquestionscompleted: 12,
      Status: 'Feedback'
    },
    {
      SessionID: 'session_004',
      Username: 'sarah.wilson',
      Requestnumber: 'REQ-2024-004',
      Ideatitle: 'Inventory Management Optimization',
      Submitteddate: '2024-11-01',
      Lastupdated: '2024-11-04',
      Totalnoofquestionscompleted: 22,
      Status: 'Approved'
    },
    {
      SessionID: 'session_005',
      Username: 'alex.brown',
      Requestnumber: 'REQ-2024-005',
      Ideatitle: 'Customer Loyalty Program Enhancement',
      Submitteddate: '2024-11-02',
      Lastupdated: '2024-11-04',
      Totalnoofquestionscompleted: 8,
      Status: 'Pending_review'
    }
  ] as RequestData[],

  // ===============================================
  // REQUEST DETAILS - Used in user-request-detail component
  // ===============================================
  REQUEST_DETAILS: [
    {
      Requestnumber: 'REQ-2024-001',
      Ideatitle: 'AI-Powered Customer Service Chatbot',
      Submitteddate: '2024-10-15',
      Lastupdated: '2024-11-01',
      Totalnoofquestionscompleted: 18,
      Status: 'Pending_review'
    },
    {
      Requestnumber: 'REQ-2024-002',
      Ideatitle: 'Digital Receipt Management System',
      Submitteddate: '2024-10-20',
      Lastupdated: '2024-11-02',
      Totalnoofquestionscompleted: 25,
      Status: 'Approved'
    },
    {
      Requestnumber: 'REQ-2024-003',
      Ideatitle: 'Mobile App for Store Locator',
      Submitteddate: '2024-10-25',
      Lastupdated: '2024-11-03',
      Totalnoofquestionscompleted: 12,
      Status: 'Feedback'
    },
    {
      Requestnumber: 'REQ-2024-004',
      Ideatitle: 'Inventory Management Optimization',
      Submitteddate: '2024-11-01',
      Lastupdated: '2024-11-04',
      Totalnoofquestionscompleted: 22,
      Status: 'Approved'
    },
    {
      Requestnumber: 'REQ-2024-005',
      Ideatitle: 'Customer Loyalty Program Enhancement',
      Submitteddate: '2024-11-02',
      Lastupdated: '2024-11-04',
      Totalnoofquestionscompleted: 8,
      Status: 'Pending_review'
    }
  ] as RequestDetails[],

  // ===============================================
  // CHAT HISTORY - Used in request detail and history components
  // ===============================================
  CHAT_HISTORY: [
    {
      sender: 'bot' as const,
      text: 'Hello! Let\'s start by understanding your idea. Give me a brief overview of your AI-Powered Customer Service Chatbot.',
      isFile: false
    },
    {
      sender: 'user' as const,
      text: 'I want to create an AI chatbot that can handle customer service inquiries automatically, reducing wait times and improving customer satisfaction.',
      isFile: false
    },
    {
      sender: 'bot' as const,
      text: 'That sounds like a great idea! Can you tell me more about the specific problems this chatbot will solve?',
      isFile: false
    },
    {
      sender: 'user' as const,
      text: 'Currently, customers have to wait in long queues for basic inquiries. The chatbot would handle FAQs, order status checks, and basic troubleshooting instantly.',
      isFile: false
    },
    {
      sender: 'bot' as const,
      text: 'Perfect! Now let me ask about the key features. What specific functionalities would you like this chatbot to have?',
      isFile: false
    },
    {
      sender: 'user' as const,
      text: 'Natural language processing, integration with our order management system, multi-language support, and escalation to human agents when needed.',
      isFile: false
    }
  ] as ChatMessage[],

  // ===============================================
  // FORM FIELDS - Default form structure used across components
  // ===============================================
  FORM_FIELDS: [
    {
      label: 'Your idea title',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/title.svg',
      completed: false,
      tooltip: 'Add static text here'
    },
    {
      label: 'Problem statement',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/problem-statement.svg',
      completed: false
    },
    {
      label: 'Objective',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/objective.svg',
      completed: false
    },
    {
      label: 'Key results',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/key-result.svg',
      completed: false
    },
    {
      label: 'Key features',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/key-feature.svg',
      completed: false
    },
    {
      label: 'Urgency',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/urgency.svg',
      completed: false
    },
    {
      label: 'Areas involved',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/area-involved.svg',
      completed: false
    },
    {
      label: 'Destination 2027 alignment',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/destination.svg',
      completed: false
    },
    {
      label: 'Risks',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/risk.svg',
      completed: false
    },
    {
      label: 'KPIs',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/key-result.svg',
      completed: false
    },
    {
      label: 'Data needed',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/data-needed.svg',
      completed: false
    },
    {
      label: 'Impact',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/impact.svg',
      completed: false
    },
    {
      label: 'Implementation considerations',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/implementation.svg',
      completed: false
    },
    {
      label: 'Dependencies',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/dependencies.svg',
      completed: false
    },
    {
      label: 'Key dates',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/key-dates.svg',
      completed: false
    },
    {
      label: 'Timelines',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/timeline.svg',
      completed: false
    },
    {
      label: 'Business sponsor',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/business-sponsor.svg',
      completed: false
    },
    {
      label: 'Budget details',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/budget-details.svg',
      completed: false
    },
    {
      label: 'Stakeholders',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/stakeholders.svg',
      completed: false
    },
    {
      label: 'Out of scope',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/scope.svg',
      completed: false
    },
    {
      label: 'Business case impacts',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/business-case-impact.svg',
      completed: false
    },
    {
      label: 'Portfolio alignment',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/portfolio-alignment.svg',
      completed: false
    },
    {
      label: 'IT sponsor',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/it-sponsor.svg',
      completed: false
    },
    {
      label: 'Additional attachments',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/additional-attachments.svg',
      completed: false
    },
    {
      label: 'Additional comments',
      value: '',
      valid: false,
      editing: false,
      image: 'assets/images/additional-comments.svg',
      completed: false
    }
  ] as FormField[],

  // ===============================================
  // POPULATED FORM FIELDS - Used in request detail for demo
  // ===============================================
  POPULATED_FORM_FIELDS: [
    { 
      label: 'Your idea title', 
      value: 'AI-Powered Customer Service Chatbot', 
      completed: true, 
      valid: true,
      editing: false,
      image: 'assets/images/title.svg' 
    },
    { 
      label: 'Problem statement', 
      value: 'Long customer wait times for basic inquiries affecting customer satisfaction', 
      completed: true, 
      valid: true,
      editing: false,
      image: 'assets/images/problem-statement.svg' 
    },
    { 
      label: 'Objective', 
      value: 'Reduce response time for customer inquiries and improve overall customer experience', 
      completed: true, 
      valid: true,
      editing: false,
      image: 'assets/images/objective.svg' 
    },
    { 
      label: 'Key results', 
      value: 'Reduce wait time by 80%, handle 70% of inquiries automatically, improve CSAT by 25%', 
      completed: true, 
      valid: true,
      editing: false,
      image: 'assets/images/key-result.svg' 
    },
    { 
      label: 'Key features', 
      value: 'Natural language processing, order management integration, multi-language support, human escalation', 
      completed: true, 
      valid: true,
      editing: false,
      image: 'assets/images/key-feature.svg' 
    },
    { 
      label: 'Urgency', 
      value: 'High - Customer satisfaction scores are declining due to long wait times', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/urgency.svg' 
    },
    { 
      label: 'Areas involved', 
      value: 'Customer Service, IT, Marketing, Operations', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/area-involved.svg' 
    },
    { 
      label: 'Destination 2027 alignment', 
      value: '', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/destination.svg' 
    },
    { 
      label: 'Risks', 
      value: '', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/risk.svg' 
    },
    { 
      label: 'KPIs', 
      value: '', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/key-result.svg' 
    },
    { 
      label: 'Data needed', 
      value: '', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/data-needed.svg' 
    },
    { 
      label: 'Impact', 
      value: '', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/impact.svg' 
    },
    { 
      label: 'Implementation considerations', 
      value: '', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/implementation.svg' 
    },
    { 
      label: 'Dependencies', 
      value: '', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/dependencies.svg' 
    },
    { 
      label: 'Key dates', 
      value: '', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/key-dates.svg' 
    },
    { 
      label: 'Timelines', 
      value: '', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/timeline.svg' 
    },
    { 
      label: 'Business sponsor', 
      value: '', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/business-sponsor.svg' 
    },
    { 
      label: 'Budget details', 
      value: '', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/budget-details.svg' 
    },
    { 
      label: 'Stakeholders', 
      value: '', 
      completed: false, 
      valid: false,
      image: 'assets/images/stakeholders.svg',
      editing: false
    },
    { 
      label: 'Out of scope', 
      value: '', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/scope.svg' 
    },
    { 
      label: 'Business case impacts', 
      value: '', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/business-case-impact.svg' 
    },
    { 
      label: 'Portfolio alignment', 
      value: '', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/portfolio-alignment.svg' 
    },
    { 
      label: 'IT sponsor', 
      value: '', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/it-sponsor.svg' 
    },
    { 
      label: 'Additional attachments', 
      value: '', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/additional-attachments.svg' 
    },
    { 
      label: 'Additional comments', 
      value: '', 
      completed: false, 
      valid: false,
      editing: false,
      image: 'assets/images/additional-comments.svg' 
    }
  ] as FormField[],

  // ===============================================
  // MOCK RESPONSE STAGES - Used in history component for conversation flow
  // ===============================================
  MOCK_RESPONSE_STAGES: [
    {
      // Stage 0: After user describes initial idea
      botMessage: "That's a fantastic idea! Let me help you develop this further. Can you tell me more about the specific problem this will solve?",
      formUpdates: {
        'Your idea title': 'AI-Powered Customer Service Enhancement'
      },
      buttons: []
    },
    {
      // Stage 1: After user explains the problem
      botMessage: "I see the challenge clearly now. What specific goals do you want to achieve with this solution?",
      formUpdates: {
        'Problem statement': 'Current system limitations create customer frustration and operational inefficiencies that need to be addressed.'
      },
      buttons: []
    },
    {
      // Stage 2: After user explains objectives
      botMessage: "Excellent objectives! How will you measure the success of this initiative?",
      formUpdates: {
        'Objective': 'Implement improvements to enhance efficiency, reduce costs, and improve customer satisfaction.'
      },
      buttons: []
    },
    {
      // Stage 3: After user provides metrics
      botMessage: "Great metrics! What key features do you envision for this solution?",
      formUpdates: {
        'Key results': 'Achieve measurable improvements in key performance indicators and customer satisfaction metrics.'
      },
      buttons: []
    },
    {
      // Stage 4: After user describes features
      botMessage: "Comprehensive feature set! Is there any urgency or specific timeline driving this project?",
      formUpdates: {
        'Key features': 'Core functionality with user-friendly interface and integration capabilities.'
      },
      buttons: []
    },
    {
      // Stage 5: After user mentions timeline
      botMessage: "Understood! Which areas of your organization will be involved in this project?",
      formUpdates: {
        'Urgency': 'Project timeline aligns with business priorities and operational requirements.'
      },
      dropdown: ['Customer Service', 'IT Department', 'Marketing', 'Operations', 'Finance', 'Legal'],
      fieldName: 'Areas involved'
    },
    {
      // Stage 6: After areas selection
      botMessage: "Perfect team involvement! How does this align with your Destination 2027 strategic goals?",
      formUpdates: {
        'Areas involved': 'Cross-functional team collaboration'
      },
      dropdown: ['Digital Transformation', 'Customer Experience Excellence', 'Operational Efficiency', 'Innovation Leadership'],
      fieldName: 'Destination 2027 alignment'
    },
    {
      // Stage 7: After alignment selection
      botMessage: "Excellent alignment! What potential risks should we consider for this project?",
      formUpdates: {
        'Destination 2027 alignment': 'Strategic alignment with organizational goals'
      },
      buttons: []
    },
    {
      // Stage 8: After risks discussion
      botMessage: "Good thinking on risk management! What KPIs will you track to measure success?",
      formUpdates: {
        'Risks': 'Identified risks with mitigation strategies and contingency plans.'
      },
      buttons: []
    },
    {
      // Stage 9: KPIs
      botMessage: "Excellent KPIs! What specific data will you need to collect and analyze?",
      formUpdates: {
        'KPIs': 'Key performance indicators with clear targets and measurement criteria.'
      },
      buttons: []
    },
    {
      // Stage 10: Data needed
      botMessage: "Great data strategy! What impact do you expect this to have on business operations?",
      formUpdates: {
        'Data needed': 'Comprehensive data collection and analysis requirements.'
      },
      buttons: []
    },
    {
      // Stage 11: Impact
      botMessage: "Significant impact potential! What key considerations should we keep in mind during implementation?",
      formUpdates: {
        'Impact': 'Positive business impact with measurable operational improvements.'
      },
      buttons: []
    },
    {
      // Stage 12: Implementation considerations
      botMessage: "Thoughtful implementation approach! What dependencies do we need to account for?",
      formUpdates: {
        'Implementation considerations': 'Strategic implementation approach with proper planning and execution.'
      },
      buttons: []
    },
    {
      // Stage 13: Dependencies
      botMessage: "Good dependency planning! What are the key dates and milestones?",
      formUpdates: {
        'Dependencies': 'Project dependencies identified with clear ownership and timelines.'
      },
      buttons: []
    },
    {
      // Stage 14: Key dates
      botMessage: "Clear timeline structure! What specific timelines are we working with?",
      formUpdates: {
        'Key dates': 'Project milestones with defined deliverables and deadlines.'
      },
      buttons: ['3 months', '6 months', '12 months', '18 months'],
      fieldName: 'Timelines'
    },
    {
      // Stage 15: Timelines
      botMessage: "Perfect timeline planning! Who will be the business sponsor?",
      formUpdates: {
        'Timelines': 'Appropriate timeline with phased implementation approach'
      },
      mappingButton: ['Department Director', 'Operations Manager', 'Program Manager', 'Other'],
      fieldName: 'Business sponsor'
    },
    {
      // Stage 16: Business sponsor
      botMessage: "Great sponsor alignment! What budget details should we consider?",
      formUpdates: {
        'Business sponsor': 'Executive sponsor with appropriate authority and commitment'
      },
      buttons: []
    },
    {
      // Stage 17: Budget details
      botMessage: "Solid budget planning! Who are the key stakeholders involved?",
      formUpdates: {
        'Budget details': 'Budget allocation with clear cost breakdown and financial justification.'
      },
      buttons: []
    },
    {
      // Stage 18: Stakeholders
      botMessage: "Comprehensive stakeholder involvement! What should be explicitly out of scope?",
      formUpdates: {
        'Stakeholders': 'Key stakeholders identified with roles and responsibilities defined.'
      },
      buttons: []
    },
    {
      // Stage 19: Out of scope
      botMessage: "Clear scope boundaries! What business case impacts should we highlight?",
      formUpdates: {
        'Out of scope': 'Clear scope definition with excluded items for future consideration.'
      },
      dropdown: ['Cost Reduction', 'Revenue Growth', 'Customer Experience', 'Operational Efficiency', 'Risk Mitigation'],
      fieldName: 'Business case impacts'
    },
    {
      // Stage 20: Business case impacts
      botMessage: "Strong business case! How does this align with your portfolio strategy?",
      formUpdates: {
        'Business case impacts': 'Positive business case with clear value proposition'
      },
      buttons: ['High alignment', 'Medium alignment', 'Strategic initiative'],
      fieldName: 'Portfolio alignment'
    },
    {
      // Stage 21: Portfolio alignment
      botMessage: "Excellent portfolio fit! Who will be the IT sponsor for technical oversight?",
      formUpdates: {
        'Portfolio alignment': 'Strong portfolio alignment with strategic objectives'
      },
      mappingButton: ['IT Director', 'CTO', 'Technical Lead', 'Other'],
      fieldName: 'IT sponsor'
    },
    {
      // Stage 22: IT sponsor
      botMessage: "Perfect technical leadership! Do you have any additional documents?",
      formUpdates: {
        'IT sponsor': 'Technical sponsor with expertise and project commitment'
      },
      buttons: []
    },
    {
      // Stage 23: Additional attachments
      botMessage: "Great documentation! Any final thoughts or additional comments?",
      formUpdates: {
        'Additional attachments': 'Supporting documentation available for review'
      },
      buttons: []
    },
    {
      // Stage 24: Final stage
      botMessage: "Perfect! Your business idea is now comprehensive and well-documented. All key areas have been addressed and the proposal is ready for review.",
      formUpdates: {
        'Additional comments': 'This initiative represents a strategic investment in operational excellence. The comprehensive approach ensures all stakeholders are aligned and success metrics are clearly defined.'
      },
      buttons: ['Yes, everything looks perfect!', 'Let me review and make final edits', 'Submit as is']
    }
  ] as MockResponseStage[],

  // ===============================================
  // DETAILED CHATBOT CONVERSATION FLOW - Used in create component for demo
  // ===============================================
  CHATBOT_CONVERSATION_STAGES: [
    {
      // Stage 0: After user describes initial idea
      botMessage: "That's a fantastic idea! An AI-powered customer service chatbot can really transform the customer experience. Let me help you develop this further. Can you tell me more about the specific problem this will solve?",
      formUpdates: {
        'Your idea title': 'AI-Powered Customer Service Chatbot'
      },
      buttons: []
    },
    {
      // Stage 1: After user explains the problem
      botMessage: "I see the challenge clearly now. Long wait times definitely impact customer satisfaction. What specific goals do you want to achieve with this chatbot solution?",
      formUpdates: {
        'Problem statement': 'Customers experience long wait times for basic inquiries like store hours, product availability, and return policies, leading to poor customer satisfaction and increased staff workload.'
      },
      buttons: []
    },
    {
      // Stage 2: After user explains objectives
      botMessage: "Excellent objectives! How will you measure the success of this initiative? What key results are you targeting?",
      formUpdates: {
        'Objective': 'Implement an AI-powered chatbot to provide instant customer service, reduce wait times, improve customer satisfaction, and optimize staff efficiency.'
      },
      buttons: []
    },
    {
      // Stage 3: After user provides metrics
      botMessage: "Great metrics! Those are very achievable and measurable goals. What key features do you envision for this chatbot?",
      formUpdates: {
        'Key results': 'Reduce customer wait time by 80%, increase customer satisfaction scores by 25%, decrease staff workload on basic inquiries by 60%, handle 1000+ daily interactions autonomously.'
      },
      buttons: []
    },
    {
      // Stage 4: After user describes features
      botMessage: "Comprehensive feature set! Is there any urgency or specific timeline driving this project?",
      formUpdates: {
        'Key features': 'FAQ handling, real-time product availability checking, simple return processing, appointment scheduling, human agent escalation, POS system integration.'
      },
      buttons: []
    },
    {
      // Stage 5: After user mentions timeline
      botMessage: "That makes perfect sense for the holiday season! Which areas of your organization will be involved in this project?",
      formUpdates: {
        'Urgency': 'High - Must be ready by November for holiday season rush (Black Friday and Christmas shopping periods)'
      },
      dropdown: ['Customer Service', 'IT Department', 'Marketing', 'Operations', 'Finance', 'Legal'],
      fieldName: 'Areas involved'
    },
    {
      // Stage 6: After areas selection
      botMessage: "Perfect team involvement! How does this align with your Destination 2027 strategic goals?",
      formUpdates: {
        'Areas involved': 'Customer Service, IT Department, Marketing, Operations'
      },
      dropdown: ['Digital Transformation', 'Customer Experience Excellence', 'Operational Efficiency', 'Innovation Leadership'],
      fieldName: 'Destination 2027 alignment'
    },
    {
      // Stage 7: After alignment selection
      botMessage: "Excellent alignment! What potential risks should we consider for this project?",
      formUpdates: {
        'Destination 2027 alignment': 'Digital Transformation, Customer Experience Excellence'
      },
      buttons: []
    },
    {
      // Stage 8: After risks discussion
      botMessage: "Good thinking on risk management! Now let's dive into the performance metrics. What KPIs will you track to measure success?",
      formUpdates: {
        'Risks': 'Integration challenges with legacy POS systems, customer adoption resistance, training requirements for staff, potential system downtime during peak periods.'
      },
      buttons: []
    },
    {
      // Stage 9: KPIs
      botMessage: "Excellent KPIs! What specific data will you need to collect and analyze for this chatbot project?",
      formUpdates: {
        'KPIs': 'Response time reduction (target <30 seconds), Customer satisfaction score (target >4.5/5), Resolution rate (target >85%), Cost savings per interaction, Daily active users, Escalation rate to human agents'
      },
      buttons: []
    },
    {
      // Stage 10: Data needed
      botMessage: "Great data strategy! What impact do you expect this chatbot to have on your business operations?",
      formUpdates: {
        'Data needed': 'Customer interaction logs, Product catalog data, FAQ database, Customer feedback scores, Response time metrics, Agent workload statistics, Integration APIs data'
      },
      buttons: []
    },
    {
      // Stage 11: Impact
      botMessage: "Significant impact potential! What key considerations should we keep in mind during implementation?",
      formUpdates: {
        'Impact': 'Reduced operational costs by 40%, improved customer satisfaction, faster issue resolution, 24/7 service availability, reduced staff workload, scalable customer support, consistent service quality'
      },
      buttons: []
    },
    {
      // Stage 12: Implementation considerations
      botMessage: "Thoughtful implementation approach! What dependencies do we need to account for in this project?",
      formUpdates: {
        'Implementation considerations': 'Staff training programs, API integrations with existing systems, data privacy compliance, multilingual support setup, fallback procedures, testing protocols, gradual rollout strategy'
      },
      buttons: []
    },
    {
      // Stage 13: Dependencies
      botMessage: "Good dependency planning! What are the key dates and milestones for this project?",
      formUpdates: {
        'Dependencies': 'POS system API availability, IT infrastructure upgrades, staff training completion, legal compliance approval, customer data migration, third-party integrations'
      },
      buttons: []
    },
    {
      // Stage 14: Key dates
      botMessage: "Clear timeline structure! What specific timelines are we working with for each phase?",
      formUpdates: {
        'Key dates': 'Project kickoff: January 15, 2025; Development completion: March 30, 2025; Testing phase: April 1-15, 2025; Staff training: April 16-30, 2025; Soft launch: May 1, 2025; Full deployment: October 1, 2025'
      },
      buttons: ['3 months', '6 months', '12 months', '18 months'],
      fieldName: 'Timelines'
    },
    {
      // Stage 15: Timelines
      botMessage: "Perfect timeline planning! Who will be the business sponsor championing this initiative?",
      formUpdates: {
        'Timelines': '12 months - Full implementation with phased rollout approach'
      },
      mappingButton: ['Customer Service Director', 'Operations Manager', 'Marketing Director', 'Other'],
      fieldName: 'Business sponsor'
    },
    {
      // Stage 16: Business sponsor
      botMessage: "Great sponsor alignment! What budget details should we consider for this project?",
      formUpdates: {
        'Business sponsor': 'Customer Service Director, Sarah Johnson'
      },
      buttons: []
    },
    {
      // Stage 17: Budget details
      botMessage: "Solid budget planning! Who are the key stakeholders involved in this initiative?",
      formUpdates: {
        'Budget details': 'Initial development: $150,000; Infrastructure setup: $50,000; Training costs: $25,000; Annual maintenance: $30,000; Total first-year investment: $255,000'
      },
      buttons: []
    },
    {
      // Stage 18: Stakeholders
      botMessage: "Comprehensive stakeholder involvement! What should be explicitly out of scope for this project?",
      formUpdates: {
        'Stakeholders': 'Customer Service Team, IT Department, Marketing Team, Legal Compliance, Finance Department, Training Coordinators, External Technology Vendors'
      },
      buttons: []
    },
    {
      // Stage 19: Out of scope
      botMessage: "Clear scope boundaries! What business case impacts should we highlight?",
      formUpdates: {
        'Out of scope': 'Complex technical support issues, Financial transactions processing, Product recommendations engine, Advanced analytics dashboard, Multi-language support (Phase 2), Mobile app integration (Phase 2)'
      },
      dropdown: ['Cost Reduction', 'Revenue Growth', 'Customer Experience', 'Operational Efficiency', 'Risk Mitigation'],
      fieldName: 'Business case impacts'
    },
    {
      // Stage 20: Business case impacts
      botMessage: "Strong business case! How does this align with your portfolio strategy?",
      formUpdates: {
        'Business case impacts': 'Cost Reduction, Customer Experience, Operational Efficiency'
      },
      buttons: ['High alignment', 'Medium alignment', 'Strategic initiative'],
      fieldName: 'Portfolio alignment'
    },
    {
      // Stage 21: Portfolio alignment
      botMessage: "Excellent portfolio fit! Who will be the IT sponsor for technical oversight?",
      formUpdates: {
        'Portfolio alignment': 'High alignment - Supports digital transformation and customer experience excellence goals'
      },
      mappingButton: ['IT Director', 'CTO', 'Technical Lead', 'Other'],
      fieldName: 'IT sponsor'
    },
    {
      // Stage 22: IT sponsor
      botMessage: "Perfect technical leadership! Do you have any additional documents to support this proposal?",
      formUpdates: {
        'IT sponsor': 'IT Director, Michael Chen'
      },
      buttons: []
    },
    {
      // Stage 23: Additional attachments
      botMessage: "Comprehensive documentation! Any final thoughts or additional comments about this initiative?",
      formUpdates: {
        'Additional attachments': 'Project requirements document, technical specifications, vendor proposals available for review'
      },
      buttons: []
    },
    {
      // Stage 24: Additional comments
      botMessage: "Fantastic! I've captured all the details for your AI-powered customer service chatbot initiative. This looks like a well-planned project that will significantly improve customer experience. Would you like to review everything before submitting?",
      formUpdates: {
        'Additional comments': 'This initiative represents a strategic investment in customer experience and operational efficiency. The phased approach ensures minimal disruption while maximizing benefits. Success metrics are clearly defined and achievable.'
      },
      buttons: ['Yes, everything looks perfect!', 'Let me review and make final edits', 'Submit as is']
    }
  ] as MockResponseStage[],

  // ===============================================
  // DEMO DRAFTS - Used in left-nav component
  // ===============================================
  DEMO_DRAFTS: [
    {
      session_id: 'demo_session_001',
      user_name: 'demo_user_1',
      displayTitle: 'AI Customer Service Bot',
      created_date: '2024-11-01T10:30:00Z',
      sessionDataDraft: {
        chatHistory: [
          {
            sender: 'bot' as const,
            text: 'Let\'s start by understanding your idea. Give me a brief overview, covering the key challenge and what you want to achieve',
            isFile: false
          },
          {
            sender: 'user' as const,
            text: 'I want to create an AI-powered customer service chatbot to reduce wait times and improve customer satisfaction',
            isFile: false
          }
        ],
        formFieldValue: [
          { label: 'Your idea title', value: 'AI Customer Service Bot', valid: true, editing: false, image: 'assets/images/title.svg', completed: true },
          { label: 'Problem statement', value: 'Long customer wait times for basic inquiries', valid: true, editing: false, image: 'assets/images/problem-statement.svg', completed: true },
          { label: 'Objective', value: '', valid: false, editing: false, image: 'assets/images/objective.svg', completed: false }
        ]
      }
    },
    {
      session_id: 'demo_session_002',
      user_name: 'demo_user_2',
      displayTitle: 'Digital Receipt System',
      created_date: '2024-11-02T14:45:00Z',
      sessionDataDraft: {
        chatHistory: [
          {
            sender: 'bot' as const,
            text: 'Let\'s start by understanding your idea. Give me a brief overview, covering the key challenge and what you want to achieve',
            isFile: false
          },
          {
            sender: 'user' as const,
            text: 'I want to digitize our receipt management process to reduce paper waste and improve customer experience',
            isFile: false
          }
        ],
        formFieldValue: [
          { label: 'Your idea title', value: 'Digital Receipt System', valid: true, editing: false, image: 'assets/images/title.svg', completed: true },
          { label: 'Problem statement', value: 'Paper receipts create waste and poor customer experience', valid: true, editing: false, image: 'assets/images/problem-statement.svg', completed: true },
          { label: 'Objective', value: 'Reduce paper waste by 90% and improve customer satisfaction', valid: true, editing: false, image: 'assets/images/objective.svg', completed: true }
        ]
      }
    }
  ] as ModifiedDraft[]
};

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

export class MockDataService {
  /**
   * Get a deep copy of form fields to avoid mutation
   */
  static getFormFields(): FormField[] {
    return JSON.parse(JSON.stringify(MOCK_DATA.FORM_FIELDS));
  }

  /**
   * Get populated form fields for demo purposes
   */
  static getPopulatedFormFields(): FormField[] {
    return JSON.parse(JSON.stringify(MOCK_DATA.POPULATED_FORM_FIELDS));
  }

  /**
   * Get mock response stages for conversation flow
   */
  static getMockResponseStages(): MockResponseStage[] {
    return JSON.parse(JSON.stringify(MOCK_DATA.MOCK_RESPONSE_STAGES));
  }

  /**
   * Get detailed chatbot conversation stages for create component demo
   */
  static getChatbotConversationStages(): MockResponseStage[] {
    return JSON.parse(JSON.stringify(MOCK_DATA.CHATBOT_CONVERSATION_STAGES));
  }

  /**
   * Get demo drafts for left navigation
   */
  static getDemoDrafts(): ModifiedDraft[] {
    return JSON.parse(JSON.stringify(MOCK_DATA.DEMO_DRAFTS));
  }

  /**
   * Get request list data
   */
  static getRequestList(): RequestData[] {
    return JSON.parse(JSON.stringify(MOCK_DATA.REQUEST_LIST));
  }

  /**
   * Get request details data
   */
  static getRequestDetails(): RequestDetails[] {
    return JSON.parse(JSON.stringify(MOCK_DATA.REQUEST_DETAILS));
  }

  /**
   * Get sample chat history
   */
  static getChatHistory(): ChatMessage[] {
    return JSON.parse(JSON.stringify(MOCK_DATA.CHAT_HISTORY));
  }

  /**
   * Format date for display (remove time component)
   */
  static formatDate(dateString: string): string {
    return dateString.split(' ')[0];
  }

  /**
   * Find request by request number
   */
  static findRequestByNumber(requestNumber: string): RequestDetails | null {
    return MOCK_DATA.REQUEST_DETAILS.find(req => req.Requestnumber === requestNumber) || null;
  }
}

// ===============================================
// HARDCODED TEXT CONSTANTS
// ===============================================

export const MOCK_TEXT = {
  // Error messages
  NETWORK_ERROR: 'Sorry for trouble, there is some network issues please try again',
  ADA_PLACEHOLDER: "ADA couldn't fill this field, please continue the conversation to fill it",
  
  // Common text
  SUBMIT_TEXT: 'Submit',
  CANCEL_TEXT: 'Cancel',
  DELETE_TEXT: 'Delete',
  EDIT_TEXT: 'Edit',
  ADD_TEXT: 'add',
  
  // Progress text
  PROGRESS_TEXT: 'Progress',
  COMPLETED_TEXT: 'completed',
  
  // Form validation
  NOT_FINAL_CONTENT: 'This is not the final content until you confirm it. This is generated by AI.',
  
  // User input placeholder
  REPLY_PLACEHOLDER: 'Reply to ADA',
  
  // File upload
  CHOOSE_FILES: 'Drag and drop or Choose files',
  FILE_UPLOAD_SUCCESS: 'File uploaded successfully',
  FILE_DELETE_SUCCESS: 'Successfully delete the file',
  
  // Button labels
  ALL_GOOD_BUTTON: 'All details looks good to me',
  YES_PERFECT: 'Yes, everything looks perfect!',
  REVIEW_EDITS: 'Let me review and make final edits',
  SUBMIT_AS_IS: 'Submit as is'
};

// ===============================================
// USER REQUEST DETAIL MOCK DATA
// ===============================================

/**
 * Mock data for User Request Detail Component
 */
export class UserRequestDetailMockData {
  
  /**
   * Get mock chat history for user request detail
   */
  static getMockChatHistory() {
    return [
      {
        sender: 'bot',
        text: 'Hello! Let\'s start by understanding your idea. Give me a brief overview of your AI-Powered Customer Service Chatbot.',
        isFile: false
      },
      {
        sender: 'user',
        text: 'I want to create an AI chatbot that can handle customer service inquiries automatically, reducing wait times and improving customer satisfaction.',
        isFile: false
      },
      {
        sender: 'bot',
        text: 'That sounds like a great idea! Can you tell me more about the specific problems this chatbot will solve?',
        isFile: false
      },
      {
        sender: 'user',
        text: 'Currently, customers have to wait in long queues for basic inquiries. The chatbot would handle FAQs, order status checks, and basic troubleshooting instantly.',
        isFile: false
      },
      {
        sender: 'bot',
        text: 'Perfect! Now let me ask about the key features. What specific functionalities would you like this chatbot to have?',
        isFile: false
      },
      {
        sender: 'user',
        text: 'Natural language processing, integration with our order management system, multi-language support, and escalation to human agents when needed.',
        isFile: false
      }
    ];
  }

  /**
   * Get mock form fields for user request detail
   */
  static getMockFormFields() {
    const baseFields = [
      { label: 'Your idea title', value: 'AI-Powered Customer Service Chatbot', completed: true, image: 'assets/images/title.svg' },
      { label: 'Problem statement', value: 'Long customer wait times for basic inquiries affecting customer satisfaction', completed: true, image: 'assets/images/problem-statement.svg' },
      { label: 'Objective', value: 'Reduce response time for customer inquiries and improve overall customer experience', completed: true, image: 'assets/images/objective.svg' },
      { label: 'Key results', value: 'Reduce wait time by 80%, handle 70% of inquiries automatically, improve CSAT by 25%', completed: true, image: 'assets/images/key-result.svg' },
      { label: 'Key features', value: 'Natural language processing, order management integration, multi-language support, human escalation', completed: true, image: 'assets/images/key-feature.svg' },
      { label: 'Urgency', value: 'High - Customer satisfaction scores are declining due to long wait times', completed: false, image: 'assets/images/urgency.svg' },
      { label: 'Areas involved', value: 'Customer Service, IT, Marketing, Operations', completed: false, image: 'assets/images/area-involved.svg' },
      { label: 'Destination 2027 alignment', value: '', completed: false, image: 'assets/images/destination.svg' },
      { label: 'Risks', value: '', completed: false, image: 'assets/images/risk.svg' },
      { label: 'KPIs', value: '', completed: false, image: 'assets/images/key-result.svg' },
      { label: 'Data needed', value: '', completed: false, image: 'assets/images/data-needed.svg' },
      { label: 'Impact', value: '', completed: false, image: 'assets/images/impact.svg' },
      { label: 'Implementation considerations', value: '', completed: false, image: 'assets/images/implementation.svg' },
      { label: 'Dependencies', value: '', completed: false, image: 'assets/images/dependencies.svg' },
      { label: 'Key dates', value: '', completed: false, image: 'assets/images/key-dates.svg' },
      { label: 'Timelines', value: '', completed: false, image: 'assets/images/timeline.svg' },
      { label: 'Business sponsor', value: '', completed: false, image: 'assets/images/business-sponsor.svg' },
      { label: 'Budget details', value: '', completed: false, image: 'assets/images/budget-details.svg' },
      { label: 'Stakeholders', value: '', completed: false, image: 'assets/images/stakeholders.svg' },
      { label: 'Out of scope', value: '', completed: false, image: 'assets/images/scope.svg' },
      { label: 'Business case impacts', value: '', completed: false, image: 'assets/images/business-case-impact.svg' },
      { label: 'Portfolio alignment', value: '', completed: false, image: 'assets/images/portfolio-alignment.svg' },
      { label: 'IT sponsor', value: '', completed: false, image: 'assets/images/it-sponsor.svg' },
      { label: 'Additional attachments', value: '', completed: false, image: 'assets/images/additional-attachments.svg' },
      { label: 'Additional comments', value: '', completed: false, image: 'assets/images/additional-comments.svg' }
    ];

    // Transform to include all required properties
    return baseFields.map(field => ({
      label: field.label,
      value: field.value,
      valid: field.value !== '',
      editing: false,
      image: field.image,
      completed: field.completed
    }));
  }

  /**
   * Get mock request page data
   */
  static getMockRequestPageData() {
    return {
      sessionDataId: 'session_001',
      sessionDataUserName: 'john.doe'
    };
  }

  /**
   * Generate complete mock response for user request detail
   */
  static generateMockResponse() {
    return {
      message_session_data: JSON.stringify({
        chatHistory: this.getMockChatHistory(),
        formFieldValue: this.getMockFormFields()
      })
    };
  }
}