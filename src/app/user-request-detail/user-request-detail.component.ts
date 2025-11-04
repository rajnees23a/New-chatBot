import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../service.service';
import { APP_CONSTANTS } from '../constants';
import { RequestDetails } from './user-request-detail.model';

@Component({
  selector: 'app-user-request-detail',
  templateUrl: './user-request-detail.component.html',
  styleUrls: ['./user-request-detail.component.css'],
})
export class UserRequestDetailComponent implements OnInit {
  staticText = APP_CONSTANTS.User_Request_Details;
  requestNumber: string | null = null;
  requestDetails: RequestDetails | null = null;
  activeTab: string = 'summary';
  requestData: RequestDetails[] = [];
  RequestDetailFromRequestPAge: any;
  Responsed: any;

  // Mock data for testing
  private mockRequestData: RequestDetails[] = [
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
  ];

  constructor(private route: ActivatedRoute, private api: ServiceService) {}

  ngOnInit() {
    this.requestNumber = this.route.snapshot.paramMap.get('id');
    this.api.chatDetailsForRequest$.subscribe((data) => {
      if (data) {
        this.RequestDetailFromRequestPAge = data;
      }
    });

    // Use mock data for now - uncomment the line below to use real API data
    this.loadMockData();
    // this.fetchData();
    
    // Use mock chat data for now - uncomment the line below to use real API data
    this.loadMockChatData();
    // this.fetchRequestChat();
    
    this.api.hide();
  }

  loadMockData() {
    // Load mock data and format the dates
    this.requestData = [...this.mockRequestData];
    this.requestData.forEach((item: { Submitteddate: string | any[] }) => {
      item.Submitteddate = item.Submitteddate.slice(0, 10); // Extract the date part (YYYY-MM-DD)
    });
    
    // Find the specific request details based on the request number from route
    this.requestDetails =
      this.requestData.find(
        (req: { Requestnumber: string | null }) =>
          req.Requestnumber == this.requestNumber
      ) ?? null;
  }

  loadMockChatData() {
    // Mock chat response data for the "Your idea" tab
    const mockChatHistory = [
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

    // Mock form field values that would be populated from the conversation
    const mockFormFields = [
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
    ].map(field => ({
      label: field.label,
      value: field.value,
      valid: field.value !== '',
      editing: false,
      image: field.image,
      completed: field.completed
    }));

    this.Responsed = {
      message_session_data: JSON.stringify({
        chatHistory: mockChatHistory,
        formFieldValue: mockFormFields
      })
    };
    
    // Set mock request detail from request page data
    if (!this.RequestDetailFromRequestPAge) {
      this.RequestDetailFromRequestPAge = {
        sessionDataId: 'session_001',
        sessionDataUserName: 'john.doe'
      };
    }
  }

  fetchData() {
    const data = { user_name: this.api.userName };
    const formData: FormData = new FormData();
    formData.append('request', JSON.stringify(data));
    this.api.getRequestData(formData).subscribe((res) => {
      const data = res.my_request_submitted_data;
      this.requestData = data.sessions;

      this.requestData.forEach((item: { Submitteddate: string | any[] }) => {
        item.Submitteddate = item.Submitteddate.slice(0, 10); // Extract the date part (YYYY-MM-DD)
      });
      this.requestDetails =
        this.requestData.find(
          (req: { Requestnumber: string | null }) =>
            req.Requestnumber == this.requestNumber
        ) ?? null;
    });
  }
  fetchRequestChat() {
    if (this.RequestDetailFromRequestPAge) {
      let newData = {
        session_id: this.RequestDetailFromRequestPAge.sessionDataId,
        user_name: this.RequestDetailFromRequestPAge.sessionDataUserName,
      };
      const formData: FormData = new FormData();
      formData.append('request', JSON.stringify(newData));
      this.api.getRequestChatData(formData).subscribe((res) => {
        this.Responsed = res;
      });
    }
  }

  processData(data: any) {
    if (data) {
      let modifiedData = JSON.parse(data.message_session_data);
      let addsomemorekey = {
        session_id: this.RequestDetailFromRequestPAge.sessionDataId,
        user_name: this.RequestDetailFromRequestPAge.sessionDataUserName,
        chatData: modifiedData,
        comingFrom: 'request',
      };
      this.api.setData(addsomemorekey);
    }
  }

  chatDetail() {
    this.api.show();
    this.processData(this.Responsed);
    setTimeout(() => {
      this.api.hide();
    }, 2000);
  }
}
