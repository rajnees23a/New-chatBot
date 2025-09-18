import { Component, OnInit } from '@angular/core';
import { SerrviceService } from '../serrvice.service'
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
  requestData = [
  {
    SessionID: "S001",
    Username: "john_doe",
    Requestnumber: "REQ-1001",
    Ideatitle: "AI Chatbot Integration",
    Submitteddate: "2025-09-01",
    Lastupdated: "2025-09-10",
    Totalnoofquestionscompleted: 18,
    Status: "Pending_review"
  },
  {
    SessionID: "S002",
    Username: "jane_smith",
    Requestnumber: "REQ-1002",
    Ideatitle: "Cloud Migration Strategy",
    Submitteddate: "2025-08-28",
    Lastupdated: "2025-09-05",
    Totalnoofquestionscompleted: 25,
    Status: "Approved"
  },
  {
    SessionID: "S003",
    Username: "mike_ross",
    Requestnumber: "REQ-1003",
    Ideatitle: "Data Security Enhancement",
    Submitteddate: "2025-09-03",
    Lastupdated: "2025-09-12",
    Totalnoofquestionscompleted: 12,
    Status: "Feedback"
  }
];


  constructor(private api: SerrviceService, private router: Router) {

  }

  ngOnInit(): void {
    this.fetchData();
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
