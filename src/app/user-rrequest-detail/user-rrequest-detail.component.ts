import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SerrviceService } from '../serrvice.service';

@Component({
  selector: 'app-user-rrequest-detail',
  templateUrl: './user-rrequest-detail.component.html',
  styleUrls: ['./user-rrequest-detail.component.css']
})

export class UserRRequestDetailComponent implements OnInit {
  requestNumber: string | null = null;
  requestDetails: any;
  activeTab: string = 'summary';

  requests = [
    { requestNumber: 'ADA0001', ideaTitle: 'Streamlining onboarding', submittedDate: '03 Jan 2024', lastUpdated: '16 Jan 2024', totalQuestionsCompleted: 10, totalQuestions: 20, status: 'Pending-review', comments: 'NA' },
    { requestNumber: 'ADA0002', ideaTitle: 'AI Efficiency', submittedDate: '05 Feb 2024', lastUpdated: '10 Feb 2024', totalQuestionsCompleted: 15, totalQuestions: 25, status: 'Feedback', comments: 'Requires revision' },
    { requestNumber: 'ADA0003', ideaTitle: 'Web Performance', submittedDate: '20 Jan 2024', lastUpdated: '22 Jan 2024', totalQuestionsCompleted: 25, totalQuestions: 25, status: 'Approved', comments: 'Great job!' }
  ];
  requestData: any;
  RequestDetailFromRequestPAge:any;
  Responsed: any;

  constructor(private route: ActivatedRoute,private api: SerrviceService) {}

  ngOnInit() {
    this.requestNumber = this.route.snapshot.paramMap.get('id');
    // console.log("1",this.requestNumber);
    this.api.chatDetailsForRequest$.subscribe((data) => {
      if (data) {
        console.log("1",data);
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
        this.api.getRequestData(formData).subscribe(res =>{

          const data = res.my_request_submitted_data
          this.requestData = data.sessions
          
          this.requestData.forEach((item: { Submitteddate: string | any[]; }) => {
            item.Submitteddate = item.Submitteddate.slice(0, 10);  // Extract the date part (YYYY-MM-DD)
          });
          this.requestDetails = this.requestData.find((req: { Requestnumber: string | null; }) => req.Requestnumber == this.requestNumber);
        }); 
        
        // this.setData();
  }
  fetchRequestChat() {
    if(this.RequestDetailFromRequestPAge){

      let newData = {
        session_id: this.RequestDetailFromRequestPAge.sessionDataId,
        user_name: this.RequestDetailFromRequestPAge.sessionDataUserName
      }
      const formData: FormData = new FormData();
      formData.append('request', JSON.stringify(newData));
      this.api.getRequestChatData(formData).subscribe(res =>{
  
       console.log("rajneesh------",res);
       this.Responsed= res
      //  this.processData(res)
       
      }); 
    }
    
  }

  processData(data: any) {
        
    // Ensure the data is valid before accessing it
    if (data) {
      
    let modifiedData =  JSON.parse(data.message_session_data);
    let addsomemorekey = {
      session_id: this.RequestDetailFromRequestPAge.sessionDataId,
        user_name: this.RequestDetailFromRequestPAge.sessionDataUserName,
        chatData : modifiedData,
        comingFrom : "request"
    }
    this.api.setData(addsomemorekey);
  }
}

chatDetail(){
  this.api.show();
  this.processData(this.Responsed)
  setTimeout(() => {
    this.api.hide();
  }, 2000);
}
}
