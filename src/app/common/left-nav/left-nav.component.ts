import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ServiceService } from '../../service.service';
import { filter, Subscription } from 'rxjs';
import * as bootstrap from 'bootstrap';
import { APP_CONSTANTS } from '../../constants';
import { ModifiedDraft } from './left-nav.model';
import { MockDataService } from '../../mock-data';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.css']
})
export class LeftNavComponent implements OnInit, OnDestroy, AfterViewInit {

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

  constructor(private router: Router, private dataService: ServiceService, private cdr: ChangeDetectorRef) { }
  
  isCollapsed = false;
  isRecentDelete = false;
  deletingUserNAme = '';
  deleteingSesionId = '';
  deletingTitle = '';
  successDivVisible = false;
  successDivText = '';

  ngOnInit() {
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
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => this.refreshDrafts(), 100);
    });
    
    // Initialize tooltips with hover-only behavior
    this.initializeTooltips();
  }

  ngAfterViewInit() {
    // Re-initialize tooltips after view is fully rendered
    setTimeout(() => this.initializeTooltips(), 0);
  }

  // Method to initialize tooltips with proper hover-only configuration
  initializeTooltips() {
    // Dispose any existing tooltips first
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      const instance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
      if (instance) instance.dispose();
    });

    // Initialize new tooltips with hover-only behavior
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl, {
        trigger: 'hover', // Only show on hover, not click
        placement: 'auto', // Auto placement
        container: 'body' // Append to body to avoid z-index issues
      });
    });
  }

  // Method to manually refresh drafts from session storage
  refreshDrafts() {
    if (this.mockEnabled) {
      const draftsData = this.getDraftsFromSessionStorage();
      this.processData(draftsData);
      this.cdr.detectChanges();
      // Reinitialize tooltips after data changes
      setTimeout(() => this.initializeTooltips(), 0);
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
    // Load drafts from session storage only - no demo initialization
    const draftsData = this.getDraftsFromSessionStorage();
    this.processData(draftsData);
    
    // Auto-expand sidebar when there are drafts for better demo experience
    if (this.modifiedData.length > 0 && this.mockEnabled) {
      this.isCollapsed = true;
    }
  }

  // Method to get drafts from session storage
  getDraftsFromSessionStorage(): any[] {
    const drafts = sessionStorage.getItem('chat_drafts');
    return drafts ? JSON.parse(drafts) : [];
  }

  // Method to initialize demo drafts in session storage for demo purposes
  initializeDemoSessionDrafts() {
    const demoDrafts = MockDataService.getDemoDrafts();
    sessionStorage.setItem('chat_drafts', JSON.stringify(demoDrafts));
  }



  addMockDraft(sessionId: string, userName: string, chatHistory: any[], formFieldValue: any[]) {
    if (this.mockEnabled) {
      const newDraft = {
        session_id: sessionId,
        user_name: userName,
        timestamp: new Date().toISOString(),
        chatHistory: chatHistory,
        formFieldValue: formFieldValue,
        submit: false
      };
      const existingDrafts = this.getDraftsFromSessionStorage();
      const existingIndex = existingDrafts.findIndex(draft => draft.session_id === sessionId);
      if (existingIndex > -1) {
        existingDrafts[existingIndex] = newDraft;
      } else {
        existingDrafts.unshift(newDraft);
      }
      sessionStorage.setItem('chat_drafts', JSON.stringify(existingDrafts));
      this.refreshDrafts();
    }
  }

  // Method to remove a draft from session storage
  removeMockDraft(sessionId: string, userName: string) {
    if (this.mockEnabled) {
      const existingDrafts = this.getDraftsFromSessionStorage();
      const filteredDrafts = existingDrafts.filter(draft => 
        !(draft.session_id === sessionId && draft.user_name === userName)
      );
      sessionStorage.setItem('chat_drafts', JSON.stringify(filteredDrafts));
      this.fetchDraftData();
    }
  }

  deleteDraft() {
    if (this.mockEnabled) {
      // Remove from session storage
      const existingDrafts = this.getDraftsFromSessionStorage();
      const filteredDrafts = existingDrafts.filter(draft => 
        !(draft.session_id === this.deleteingSesionId && draft.user_name === this.deletingUserNAme)
      );
      sessionStorage.setItem('chat_drafts', JSON.stringify(filteredDrafts));
      this.fetchDraftData();
      this.successDivText = this.navText.DELETE_SUCCESS;
      this.successDivCloseAfterSec();
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
        } else if (item.chatHistory && item.formFieldValue) {
          // Handle session storage format where data is directly on the item
          parsedSessionData = {
            chatHistory: item.chatHistory,
            formFieldValue: item.formFieldValue,
            submit: item.submit || false
          };
        }
        
        return {
          session_id: item.session_id,
          user_name: item.user_name,
          session_data: parsedSessionData,
          timestamp: item.timestamp // Preserve timestamp for sorting
        };
      });
      
      if (parsedData) {
        this.modifiedData = parsedData.map((item: any, index: any) => {
          // Always use simple BIC draft numbering format
          const title = `BIC ${index + 1}`;
          
          return {
            ...item,
            displayTitle: title
          };
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
    const data = {
      sessionDataDraft: item,
      sessionDataId: id,
      sessionDataUserName: userName,
      comingFrom: "draft"
    }
    this.dataService.setData(data);
    
    // Hide loader after setting data (especially important for mock data)
    setTimeout(() => {
      this.dataService.hide();
    }, 100);
    
    this.router.navigate(['/bic']);
  }

  deleteConfirmationBox(username: any, sessionid: any, title: any) {
    this.deletingUserNAme = username;
    this.deleteingSesionId = sessionid;
    this.deletingTitle = title;
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
    if (this.isCollapsed && this.mockEnabled) {
      setTimeout(() => this.refreshDrafts(), 100);
    }
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
        // If already on the 'create' page, trigger new conversation and refresh
        this.triggerNewConversation();
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

  // Method to trigger new conversation (save current and start fresh)
  triggerNewConversation() {
    // Emit event to save current conversation if user is on create page
    this.dataService.triggerAction('start_new_conversation');
    
    // Refresh drafts after a short delay to allow saving
    setTimeout(() => {
      this.refreshDrafts();
      // Auto-expand sidebar to show updated drafts
      if (!this.isCollapsed) {
        this.isCollapsed = true;
      }
    }, 1500);
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
