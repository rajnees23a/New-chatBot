import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ServiceService } from '../../service.service';
import { filter, Subscription } from 'rxjs';
import * as bootstrap from 'bootstrap';
import { APP_CONSTANTS } from '../../constants';
import { ModifiedDraft } from './left-nav.model';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.css']
})
export class LeftNavComponent implements OnInit, OnDestroy {

  readonly navText = APP_CONSTANTS.LEFT_NAV;
  public routerSubscription: Subscription = new Subscription;
  public boundClickHandler = this.closeDropdownOnClickOutside.bind(this);
  dataSubscription: Subscription = new Subscription();
  mockDraftSubscription: Subscription = new Subscription();
  modifiedData: ModifiedDraft[] = [];
  bicCounter = 1;
  selectedItem: number | null = null;
  isItemSelected: boolean = false;
  openedDropdownIndex: number | null = null;

  // Mock data for demo purposes
  // Set mockEnabled = false to use real API calls
  // Set mockEnabled = true to use mock data for demo/testing
  private mockEnabled = true; // <-- Toggle this to switch between mock and real data
  
  private mockDraftData = [
    {
      session_id: 'draft_001',
      user_name: 'john.doe',
      timestamp: '2024-11-03T14:30:00Z',
      session_data: JSON.stringify({
        chatHistory: [
          {
            text: "Hello! Let's start by understanding your idea. Give me a brief overview, covering the key challenge and what you want to achieve",
            sender: 'bot'
          },
          {
            text: "I want to create a mobile app for inventory management in our warehouses. Currently, we use paper-based tracking which is slow and error-prone.",
            sender: 'user',
            isFile: false
          },
          {
            text: "That's a great initiative! Digital inventory management can significantly improve accuracy and efficiency. Can you tell me more about the specific problems you're facing with the current paper-based system?",
            sender: 'bot'
          },
          {
            text: "We have issues with real-time tracking, frequent data entry errors, and it takes too long to locate items in our large warehouse.",
            sender: 'user',
            isFile: false
          }
        ],
        formFieldValue: [
          { label: 'Your idea title', value: 'Mobile Inventory Management App', valid: true, editing: false, image: 'assets/images/title.svg', completed: true },
          { label: 'Problem statement', value: 'Paper-based inventory tracking is slow, error-prone, and lacks real-time visibility in warehouse operations.', valid: true, editing: false, image: 'assets/images/problem-statement.svg', completed: true },
          { label: 'Objective', value: '', valid: false, editing: false, image: 'assets/images/objective.svg', completed: false }
        ],
        submit: false
      })
    },
    {
      session_id: 'draft_002', 
      user_name: 'jane.smith',
      timestamp: '2024-11-02T16:45:00Z',
      session_data: JSON.stringify({
        chatHistory: [
          {
            text: "Hello! Let's start by understanding your idea. Give me a brief overview, covering the key challenge and what you want to achieve",
            sender: 'bot'
          },
          {
            text: "I want to implement an employee wellness program with a dedicated app for tracking fitness, mental health resources, and team challenges.",
            sender: 'user',
            isFile: false
          },
          {
            text: "Excellent idea! Employee wellness programs can boost productivity and job satisfaction. What specific wellness challenges are you seeing in your organization?",
            sender: 'bot'
          }
        ],
        formFieldValue: [
          { label: 'Your idea title', value: 'Employee Wellness Program App', valid: true, editing: false, image: 'assets/images/title.svg', completed: true },
          { label: 'Problem statement', value: '', valid: false, editing: false, image: 'assets/images/problem-statement.svg', completed: false },
          { label: 'Objective', value: '', valid: false, editing: false, image: 'assets/images/objective.svg', completed: false }
        ],
        submit: false
      })
    },
    {
      session_id: 'draft_003',
      user_name: 'mike.johnson', 
      timestamp: '2024-11-01T11:20:00Z',
      session_data: JSON.stringify({
        chatHistory: [
          {
            text: "Hello! Let's start by understanding your idea. Give me a brief overview, covering the key challenge and what you want to achieve",
            sender: 'bot'
          },
          {
            text: "I want to create an automated scheduling system for our maintenance team. Currently, we schedule everything manually which leads to conflicts and inefficiencies.",
            sender: 'user',
            isFile: false
          },
          {
            text: "That sounds like a valuable automation project! Manual scheduling can definitely create bottlenecks. What are the main pain points you're experiencing with the current process?",
            sender: 'bot'
          },
          {
            text: "Double bookings, missed maintenance windows, difficulty tracking technician availability, and poor communication about schedule changes.",
            sender: 'user',
            isFile: false
          },
          {
            text: "I understand the challenges clearly. What would be your primary objectives with this automated scheduling system?",
            sender: 'bot'
          }
        ],
        formFieldValue: [
          { label: 'Your idea title', value: 'Automated Maintenance Scheduling System', valid: true, editing: false, image: 'assets/images/title.svg', completed: true },
          { label: 'Problem statement', value: 'Manual scheduling leads to double bookings, missed maintenance windows, poor technician availability tracking, and communication issues.', valid: true, editing: false, image: 'assets/images/problem-statement.svg', completed: true },
          { label: 'Objective', value: 'Implement an automated scheduling system to eliminate conflicts, improve resource utilization, and enhance communication.', valid: true, editing: false, image: 'assets/images/objective.svg', completed: true },
          { label: 'Key results', value: '', valid: false, editing: false, image: 'assets/images/key-result.svg', completed: false }
        ],
        submit: false
      })
    }
  ];


  constructor(private router: Router, private dataService: ServiceService, private cdr: ChangeDetectorRef) { }
  isCollapsed = false;
  isRecentDelete = false;
  deletingUserNAme = ''
  deleteingSesionId = ''
  deletingTitle = ''
  successDivVisible = false;
  successDivText = '';

  ngOnInit() {
    // Collapse the sidebar on route change
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isCollapsed = false;
      }
    });

    document.addEventListener('click', this.boundClickHandler);

    // Reset active item on page load or navigation, change Reset highlighted state on route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.selectedItem = null;
    });
    this.fetchDraftData();
    
    // Subscribe to mock draft changes
    if (this.mockEnabled) {
      this.mockDraftSubscription = this.dataService.mockDraft$.subscribe(draftAction => {
        if (draftAction) {
          if (draftAction.action === 'save') {
            this.addMockDraft(draftAction.sessionId, draftAction.userName, draftAction.chatHistory, draftAction.formFieldValue);
          } else if (draftAction.action === 'delete') {
            this.removeMockDraft(draftAction.sessionId, draftAction.userName);
          }
        }
      });
    }
  }

  get deleteConfirmTitle() {
    return `${this.navText.DELETE_CONFIRM_TITLE} ${this.deletingTitle} ${this.navText.DELETE_CONFIRM_SUFFIX}`;
  }

  // Method to trigger Draft data retrieval
  fetchDraftData() {
    if (this.mockEnabled) {
      // Use mock data
      this.loadMockDraftData();
    } else {
      // Use real API
      const data = { user_name: this.dataService.userName };
      this.dataService.retriveData(data);
      this.setData();
    }
  }

  loadMockDraftData() {
    // Process mock data directly
    this.processData(this.mockDraftData);
    
    // Auto-expand sidebar when there are drafts for better demo experience
    if (this.modifiedData.length > 0 && this.mockEnabled) {
      this.isCollapsed = true;
    }
  }

  // Method to add a new draft to mock data (can be called from create component)
  addMockDraft(sessionId: string, userName: string, chatHistory: any[], formFieldValue: any[]) {
    if (this.mockEnabled) {
      const newDraft = {
        session_id: sessionId,
        user_name: userName,
        timestamp: new Date().toISOString(),
        session_data: JSON.stringify({
          chatHistory: chatHistory,
          formFieldValue: formFieldValue,
          submit: false
        })
      };
      
      this.mockDraftData.unshift(newDraft); // Add to beginning of array
      this.fetchDraftData(); // Refresh the display
    }
  }

  // Method to remove a draft from mock data
  removeMockDraft(sessionId: string, userName: string) {
    if (this.mockEnabled) {
      const index = this.mockDraftData.findIndex(draft => 
        draft.session_id === sessionId && 
        draft.user_name === userName
      );
      if (index > -1) {
        this.mockDraftData.splice(index, 1);
        this.fetchDraftData(); // Refresh the display
      }
    }
  }

  deleteDraft() {
    if (this.mockEnabled) {
      // Remove from mock data
      const index = this.mockDraftData.findIndex(draft => 
        draft.session_id === this.deleteingSesionId && 
        draft.user_name === this.deletingUserNAme
      );
      if (index > -1) {
        this.mockDraftData.splice(index, 1);
        this.fetchDraftData(); // Refresh the display
      }
      
      // Show success message
      this.successDivText = this.navText.DELETE_SUCCESS;
      this.successDivCloseAfterSec();
      
      // Navigate to home
      this.router.navigate(['/home'], { queryParams: { id: 'home' } });
    } else {
      // Use real API
      const data = {
        user_name: this.deletingUserNAme,
        session_id: this.deleteingSesionId
      }
      this.dataService.deletDraftData(data);
      this.fetchDraftData();
      this.dataService.triggerAction(this.navText.DELETE_SUCCESS);
      this.router.navigate(['/home'], { queryParams: { id: 'home' } });
    }
  }

  successDivCloseAfterSec() {
    this.successDivVisible = true;
    setTimeout(() => {
      this.successDivVisible = false;
    }, 9000);
  }
  successDivCloseInstant() {
    this.successDivVisible = false;
  }

  setData() {
    this.dataSubscription = this.dataService.navbarData$.subscribe(updatedData => {
      if (updatedData && updatedData !== undefined && updatedData !== null) {
          this.processData(updatedData);
      }
    });
  }

  // Method to process the formFieldValue array and check for the specific conditions
  processData(data: any) {
    if (data && Array.isArray(data) && data.length > 0) {
      this.sortAccordingToDate(data);
      const parsedData = data.map(item => {
        let parsedSessionData = {};
        if (typeof item.session_data === 'string' && item.session_data.trim() !== '') {
          try {
            parsedSessionData = JSON.parse(item.session_data);
          } catch (e) {
            parsedSessionData = {};
          }
        } else if (typeof item.session_data === 'object') {
          // Handle case where session_data is already an object (for mock data)
          parsedSessionData = item.session_data;
        }
        // Return a new object with the original data plus the parsed session_data
        return {
          session_id: item.session_id,
          user_name: item.user_name,
          session_data: parsedSessionData,
          timestamp: item.timestamp // Preserve timestamp for sorting
        };
      });
      if (parsedData) {
        this.modifiedData = parsedData.map((item: any, index: any) => {
          if (item.session_data && item.session_data.formFieldValue !== undefined && item.session_data.formFieldValue !== null) {
            const ideaTitleObj = item.session_data.formFieldValue.find((f: { label: string; }) => f.label === this.navText.YOUR_IDEA_TITLE);
            let title: any;
            if (ideaTitleObj?.value?.trim() !== '' && ideaTitleObj?.value?.trim() !== this.navText.ADA_STATIC_TEXT) {
              title = ideaTitleObj.value
            } else {
              title = `BIC draft ${index + 1}`;
            }
            return {
              ...item,
              displayTitle: title
            };
          }
          // If formFieldValue is missing, still return the item
          return { ...item, displayTitle: `BIC draft ${index + 1}` };
        });
      }
    } else {
      this.modifiedData = [];
    }
  }

  sortAccordingToDate(arr: any) {
    arr.sort((a: { timestamp: string | number | Date; }, b: { timestamp: string | number | Date; }) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA; // descending order (latest first)
    });
  }

  onItemClick(item: any, id: any, userName: any, i: any) {
    this.dataService.show();
    setTimeout(() => {
      this.selectedItem = i;
    }, 0);
    this.isItemSelected = true;
    this.cdr.detectChanges();
    let data = {
      sessionDataDraft: item,
      sessionDataId: id,
      sessionDataUserName: userName,
      comingFrom: "draft"
    }
    this.dataService.setData(data);
    this.router.navigate(['/bic']);

  }

  deleteConfirmationBox(username: any, sessionid: any, title: any) {
    this.deletingUserNAme = username;
    this.deleteingSesionId = sessionid;
    this.deletingTitle = title
    const modalElement = document.getElementById('reviewModalDraft') as HTMLElement;
    if (modalElement) {
      const myModal = new bootstrap.Modal(modalElement);
      myModal.show();
    }
  }

  closeDropdownOnClickOutside(event: MouseEvent) {
    this.openedDropdownIndex = null;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  showHideDraft(index: number, event: MouseEvent): void {
    event.stopPropagation();
    if (this.openedDropdownIndex === index) {
      this.openedDropdownIndex = null;
    } else {
      this.openedDropdownIndex = index;
    }
  }

  navigateTo(route: string, name: any) {
    if (name == 'create') {
      if (this.router.url === '/create') {
        // If already on the 'create' page, navigate to the same route to trigger a "refresh"
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/create']);
        });
      } else {
        // Otherwise, navigate to the 'create' route
        this.router.navigate([route]);
      }
    } else {
      this.router.navigate([route]);
    }
  }

ngOnDestroy() {
  document.removeEventListener('click', this.boundClickHandler);

  if (this.routerSubscription) {
    this.routerSubscription.unsubscribe();
  }
  if (this.dataSubscription) {
    this.dataSubscription.unsubscribe();
  }
  if (this.mockDraftSubscription) {
    this.mockDraftSubscription.unsubscribe();
  }
}
}
