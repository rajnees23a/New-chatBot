import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from '../service.service';
import { APP_CONSTANTS } from '../constants';
import { RequestDetails } from './user-request-detail.model';

@Component({
  selector: 'app-user-rrequest-detail',
  templateUrl: './user-rrequest-detail.component.html',
  styleUrls: ['./user-rrequest-detail.component.css']
})

export class UserRRequestDetailComponent implements OnInit {
  staticText = APP_CONSTANTS.User_Request_Details;
  requestNumber: string | null = null;
  requestDetails: RequestDetails | null = null;
  activeTab: string = 'summary';
  requestData: RequestDetails[] = [];
  RequestDetailFromRequestPAge: any;
  Responsed: any;
  constructor(private route: ActivatedRoute, private api: ServiceService) { }

  ngOnInit() {
    this.requestNumber = this.route.snapshot.paramMap.get('id');
    this.api.chatDetailsForRequest$.subscribe((data) => {
      if (data) {
        this.RequestDetailFromRequestPAge = data;
      }
    });

    this.fetchData();
    this.fetchRequestChat();
    this.api.hide();
  }

  fetchData() {

    const data = { user_name: this.api.userName };
    const formData: FormData = new FormData();
    formData.append('request', JSON.stringify(data));
    this.api.getRequestData(formData).subscribe(res => {

      const data = res.my_request_submitted_data
      this.requestData = data.sessions

      this.requestData.forEach((item: { Submitteddate: string | any[]; }) => {
        item.Submitteddate = item.Submitteddate.slice(0, 10);  // Extract the date part (YYYY-MM-DD)
      });
     this.requestDetails = this.requestData.find((req: { Requestnumber: string | null; }) => req.Requestnumber == this.requestNumber) ?? null;
    });
  }
  fetchRequestChat() {
    if (this.RequestDetailFromRequestPAge) {
      let newData = {
        session_id: this.RequestDetailFromRequestPAge.sessionDataId,
        user_name: this.RequestDetailFromRequestPAge.sessionDataUserName
      }
      const formData: FormData = new FormData();
      formData.append('request', JSON.stringify(newData));
      this.api.getRequestChatData(formData).subscribe(res => {
        this.Responsed = res
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
        comingFrom: "request"
      }
      this.api.setData(addsomemorekey);
    }
  }

  chatDetail() {
    this.api.show();
    this.processData(this.Responsed)
    setTimeout(() => {
      this.api.hide();
    }, 2000);
  }
}
