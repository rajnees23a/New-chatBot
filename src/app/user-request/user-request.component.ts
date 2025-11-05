import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service'
import { Router } from '@angular/router';
import { APP_CONSTANTS } from '../constants';
import { RequestData } from './user-request.model';
import { MockDataService } from '../mock-data';

@Component({
  selector: 'app-user-request',
  templateUrl: './user-request.component.html',
  styleUrls: ['./user-request.component.css']
})
export class UserRequestComponent implements OnInit {
  staticText = APP_CONSTANTS.User_Request;
  tableHeaders = this.staticText.TABLE_HEADERS;
  requestData: RequestData[] = [];

  constructor(private api: ServiceService, private router: Router) {

  }

  ngOnInit(): void {
    // Use mock data for now - uncomment the line below to use real API data
    this.loadMockData();
    // this.fetchData();
  }

  loadMockData() {
    // Load mock data from centralized service and format the dates
    this.requestData = MockDataService.getRequestList();
    this.requestData.forEach((item: { Submitteddate: string | any[] }) => {
      item.Submitteddate = MockDataService.formatDate(item.Submitteddate as string);
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
