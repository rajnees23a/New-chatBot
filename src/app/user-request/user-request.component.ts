import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service'
import { Router } from '@angular/router';
import { APP_CONSTANTS } from '../constants';
import { RequestData } from './user-request.model';

@Component({
  selector: 'app-user-request',
  templateUrl: './user-request.component.html',
  styleUrls: ['./user-request.component.css']
})
export class UserRequestComponent implements OnInit {
  staticText = APP_CONSTANTS.User_Request;
  tableHeaders = this.staticText.TABLE_HEADERS;
  requestData: RequestData[] = [];

  // Mock data for testing
  private mockData: RequestData[] = [
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
  ];

  constructor(private api: ServiceService, private router: Router) {

  }

  ngOnInit(): void {
    // Use mock data for now - uncomment the line below to use real API data
    this.loadMockData();
    // this.fetchData();
  }

  loadMockData() {
    // Load mock data and format the dates
    this.requestData = [...this.mockData];
    this.requestData.forEach((item: { Submitteddate: string | any[] }) => {
      item.Submitteddate = (item.Submitteddate as string).split(' ')[0];
    });
  }

  getStatusStyle(status: string) {
    const base = {
      display: 'inline-block',
      padding: '6px 12px',
      'border-radius': '8px',
      'font-size': '0.85rem',
      'font-weight': '600'
    } as any;

    if (status === 'Approved') {
      return { ...base, 'background-color': '#198754', color: '#fff' }; // green
    }
    if (status === 'Feedback') {
      return { ...base, 'background-color': '#ffc107', color: '#212529' }; // yellow
    }
    // Pending (use light blue bg + blue text)
    if (status === 'Pending_review' || status === 'Pending-review') {
      return { ...base, 'background-color': '#E6F0FF', color: '#2B63C9' };
    }
    // default neutral
    return { ...base, 'background-color': '#f0f0f0', color: '#333' };
  }

  fetchData() {
    const dataToSend = { user_name: this.api.userName };
    const formData: FormData = new FormData();
    formData.append('request', JSON.stringify(dataToSend));
    this.api.getRequestData(formData).subscribe(res => {
      const sessionsres = res?.my_request_submitted_data?.sessions
      this.requestData = Array.isArray(sessionsres) ? sessionsres : [];
      this.requestData.forEach((item: { Submitteddate: string | any[] }) => {
        item.Submitteddate = (item.Submitteddate as string).split(' ')[0];
      });
    });
  }

  onClickRequestID(id: any, userName: any, reqId: any) {
    this.api.show();
    let data = {
      sessionDataId: id,
      sessionDataUserName: userName
    }
    this.api.setDataForRequestChatShow(data);
    setTimeout(() => {

      this.router.navigate(['/requestDetail', reqId]);
    }, 1000);

  }

}
