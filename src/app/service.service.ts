import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  // Centralized mock switch - Toggle this to switch entire application between mock and real data
  // Set to true for mock data, false for real API calls
  static readonly isMockEnabled = true;
  
  userName = environment.userName;
  portLocal = environment.portLocal;
  portDb = environment.portDb;

  private apiUrl = this.portLocal + 'ada';
  private apiUrlForAttachFile = this.portLocal + 'adaaddionalfileupload';
  private apiUrlForSubmit = this.portLocal + 'ui2dbupload';
  private apiUrlForAdditionalData = this.portLocal + 'ui2dbupload';
  private apiUrlForRetriveDraftData = this.portLocal + 'retrieve-draft';
  private apiUrlForAdditionalSubmit = this.portDb + 'updatebicfields';
  private apiDeleteDraft = this.portDb + 'delete-draft';
  private apiForRequestPage = this.portDb + 'my-requests';
  private apiForRequestPageChatDetails = this.portDb + 'db2uiretrival';

  private navbarDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  ); // BehaviorSubject to hold the current navbar data
  navbarData$: Observable<any> = this.navbarDataSubject.asObservable();
  private selectedDataSubject = new BehaviorSubject<any>(null); // This will hold the selected item data
  selectedData$ = this.selectedDataSubject.asObservable(); // Observable to be used in other components
  private dataSource = new BehaviorSubject<any>(null);
  currentData$ = this.dataSource.asObservable();
  private dataSourceForRequestChatDetails = new BehaviorSubject<any>(null);
  chatDetailsForRequest$ = this.dataSourceForRequestChatDetails.asObservable();
  private actionSubject = new BehaviorSubject<{
    message: string;
    triggered: boolean;
  }>({ message: '', triggered: false });
  action$ = this.actionSubject.asObservable();
  private loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  // Mock draft functionality
  private mockDraftSubject = new BehaviorSubject<any>(null);
  mockDraft$ = this.mockDraftSubject.asObservable();

  constructor(private http: HttpClient) {}

  // POST request to send data to the API
  postData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }),
    });
  }

  // Method to update selected data
  updateSelectedData(data: any): void {
    this.selectedDataSubject.next(data);
  }

  attachFile(data: { [key: string]: any }, file?: any) {
    const formData: FormData = new FormData();

    formData.append('request', JSON.stringify(data));

    // Append file only if provided
    if (file && file !== null) {
      formData.append('files', file, file.name);
    }

    return this.http.post(this.apiUrlForAttachFile, formData);
  }

  sendData(data: { [key: string]: any }, file?: any) {
    const formData: FormData = new FormData();

    formData.append('request', JSON.stringify(data));

    // Append file only if provided
    if (file && file !== null) {
      formData.append('files', file, file.name);
    }

    return this.http.post(this.apiUrl, formData);
  }

  submitData(data: { [key: string]: any }, file?: any) {
    const formData: FormData = new FormData();

    formData.append('request', JSON.stringify(data));

    // Append file only if provided
    if (file && file !== null) {
      formData.append('files', file, file.name);
    }

    return this.http.post(this.apiUrlForSubmit, formData);
  }

  submitAdditionalData(data: { [key: string]: any }, file?: any) {
    const formData: FormData = new FormData();

    formData.append('request', JSON.stringify(data));

    // Append file only if provided
    if (file && file !== null) {
      formData.append('files', file, file.name);
    }

    return this.http.post(this.apiUrlForAdditionalSubmit, formData);
  }

  additionalSubmitData(data: { [key: string]: any }, file?: any) {
    const formData: FormData = new FormData();

    formData.append('request', JSON.stringify(data));

    // Append file only if provided
    if (file && file !== null) {
      formData.append('files', file, file.name);
    }

    return this.http.post(this.apiUrlForAdditionalData, formData);
  }

  retriveData(data: any): void {
    const formData: FormData = new FormData();
    formData.append('request', JSON.stringify(data));

    this.http.post(this.apiUrlForRetriveDraftData, formData).subscribe(
      (response: any) => {
        // Check the response structure to ensure it's valid

        if (response && response.draft_data) {
          this.navbarDataSubject.next(response.draft_data); // Update the BehaviorSubject with the valid data
        } else {
          console.error('Invalid response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  getRequestData(data: any): Observable<any> {
    return this.http.post(this.apiForRequestPage, data);
  }

  getRequestChatData(data: any): Observable<any> {
    return this.http.post(this.apiForRequestPageChatDetails, data);
  }

  deletDraftData(data: any): void {
    const formData: FormData = new FormData();
    formData.append('request', JSON.stringify(data));

    this.http.post(this.apiDeleteDraft, formData).subscribe(
      (response: any) => {
        const data = { user_name: this.userName };
        this.retriveData(data);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  setData(data: any) {
    this.dataSource.next(data);
  }

  setDataForRequestChatShow(data: any) {
    this.dataSourceForRequestChatDetails.next(data);
  }

  // Trigger action with a custom message
  triggerAction(message: string) {
    this.actionSubject.next({ message, triggered: true });
  }

  // Reset action state
  resetAction() {
    this.actionSubject.next({ message: '', triggered: false });
  }

  show() {
    this.loading.next(true);
  }

  hide() {
    this.loading.next(false);
  }

  // Mock draft management methods
  saveMockDraft(sessionId: string, userName: string, chatHistory: any[], formFieldValue: any[]) {
    const draftData = {
      action: 'save',
      sessionId,
      userName,
      chatHistory,
      formFieldValue
    };
    this.mockDraftSubject.next(draftData);
  }

  deleteMockDraft(sessionId: string, userName: string) {
    const draftData = {
      action: 'delete',
      sessionId,
      userName
    };
    this.mockDraftSubject.next(draftData);
  }

  // Method to notify about draft changes (alias for compatibility)
  notifyDraftChange(action: string, sessionId: string, userName: string, chatHistory?: any[], formFieldValue?: any[]) {
    if (action === 'save' && chatHistory && formFieldValue) {
      this.saveMockDraft(sessionId, userName, chatHistory, formFieldValue);
    } else if (action === 'delete') {
      this.deleteMockDraft(sessionId, userName);
    }
  }
}
