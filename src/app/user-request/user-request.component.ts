import { Component, OnInit } from '@angular/core';
import {SerrviceService} from '../serrvice.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-request',
  templateUrl: './user-request.component.html',
  styleUrls: ['./user-request.component.css']
})
export class UserRequestComponent implements OnInit {
  requestData:any = [];

  constructor(private api: SerrviceService, private router: Router) {

      }
      
  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {

        const dataToSend = { user_name: this.api.userName };  
        const formData: FormData = new FormData();
        formData.append('request', JSON.stringify(dataToSend));
        this.api.getRequestData(formData).subscribe(res =>{

          const sessionsres = res?.my_request_submitted_data?.sessions
          this.requestData = Array.isArray(sessionsres) ? sessionsres:[];
          // this.requestData.forEach((item: { Submitteddate: string | any[]; }) => {
          //   item.Submitteddate = item.Submitteddate.split(' ')[0];
          //   // item.Submitteddate = item.Submitteddate.slice(0, 10);
          // });

          this.requestData.forEach((item: { Submitteddate: string | any[] }) => {
            item.Submitteddate = (item.Submitteddate as string).split(' ')[0];
          });
          console.log("requestDataffffffffffffffff",this.requestData)
        }); 
        // this.setData();
  }

    onClickRequestID(id:any, userName:any,reqId:any) {
      this.api.show();
      let data = {
        sessionDataId : id,
        sessionDataUserName: userName
      }
      this.api.setDataForRequestChatShow(data);
      setTimeout(() => {
        
        this.router.navigate(['/requestDetail',reqId]); // route to detail component
      }, 1000);

      // console.log("dat",data);
      
      // this.dataService.setData(data);
      
  }

}
