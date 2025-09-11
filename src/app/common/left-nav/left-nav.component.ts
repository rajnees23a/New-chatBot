import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SerrviceService } from '../../serrvice.service';
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
  private routerSubscription: Subscription = new Subscription;
  dataSubscription: Subscription = new Subscription();
  modifiedData: ModifiedDraft[] = [];
  bicCounter = 1;
  selectedItem: number | null = null;
  isItemSelected: boolean = false;
  openedDropdownIndex: number | null = null;


  constructor(private router: Router, private dataService: SerrviceService, private cdr: ChangeDetectorRef) { }
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

    document.addEventListener('click', this.closeDropdownOnClickOutside.bind(this));

    // Reset active item on page load or navigation, change Reset highlighted state on route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.selectedItem = null;
    });
    this.fetchDraftData();
  }

  get deleteConfirmTitle() {
    return `${this.navText.DELETE_CONFIRM_TITLE} ${this.deletingTitle} ${this.navText.DELETE_CONFIRM_SUFFIX}`;
  }

  // Method to trigger Draft data retrieval
  fetchDraftData() {
    const data = { user_name: this.dataService.userName };
    this.dataService.retriveData(data);
    this.setData();
  }

  deleteDraft() {
    const data = {
      user_name: this.deletingUserNAme,
      session_id: this.deleteingSesionId
    }
    this.dataService.deletDraftData(data);
    this.fetchDraftData();
    this.dataService.triggerAction(this.navText.DELETE_SUCCESS);
    this.router.navigate(['/home'], { queryParams: { id: 'home' } });
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
        const parsedSessionData = JSON.parse(item.session_data);

        // Return a new object with the original data plus the parsed session_data
        return {
          session_id: item.session_id,
          user_name: item.user_name,
          session_data: parsedSessionData
        };
      });
      if (parsedData) {
        this.modifiedData = parsedData.map((item: any, index: any) => {
          if (item.session_data.formFieldValue !== undefined && item.session_data.formFieldValue !== null) {
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
    this.routerSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
  }
}
