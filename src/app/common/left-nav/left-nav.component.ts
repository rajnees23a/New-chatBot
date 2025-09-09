import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ChangeDetectorRef  } from '@angular/core';
import { Router, NavigationEnd  } from '@angular/router';
import { SerrviceService } from '../../serrvice.service';  // Import the DataService
import { filter, Subscription } from 'rxjs';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.css']
})
export class NavbarComponent implements OnInit {
  navbarData: any;  // This will store the latest data for the Navbar
  private routerSubscription: Subscription = new Subscription;
  dataSubscription: Subscription = new Subscription(); 
  sessionData: any[] = []; // Store the data fetched from API
  processedData: any[] = []; // Store the processed data for displaying
modifiedData: any;
modifiedDataAgain: any;
bicCounter = 1;
selectedItem: number | null = null;
isItemSelected: boolean = false;
  activeSelectedAtime: any;
  openedDropdownIndex: number | null = null;


  constructor(private router: Router, private dataService: SerrviceService,private cdr: ChangeDetectorRef) {}
  isCollapsed = false;
  isRecentDelete = false;
  // activeMenuItem: string = 'home';  
  deletingUserNAme = ''
  deleteingSesionId = ''
  deletingTitle = ''
  successDivVisible = false;
  successDivText = "";
  
  menuItems = [
    { icon: 'home', label: 'Home', route: '/home' },
    { icon: 'rocket-takeoff', label: 'Request', route: '/request' },
    { icon: 'settings', label: 'Settings', route: '/trial' },
    // { icon: 'trial', label: 'Settings', route: '/trial' },
  ];

  ngOnInit(){

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isCollapsed = false; // Collapse the sidebar on route change
      }
    });
    document.addEventListener('click', this.closeDropdownOnClickOutside.bind(this));
    // Reset active item on page load or navigation change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.selectedItem  = null;  // Reset highlighted state on route change
    });
    console.log("selecteditem",this.selectedItem);
    this.fetchData();
  }

    // Method to trigger data retrieval
    fetchData() {
      const data = { user_name: this.dataService.userName };  // Data to pass to the API
      this.dataService.retriveData(data); 
      this.setData();
    }

    deleteDraft(){
      // console.log("deleted",username,sessionid);
      
      const data = {
        user_name: this.deletingUserNAme,
        session_id: this.deleteingSesionId
      }
      this.dataService.deletDraftData(data);
      this.fetchData();
      this.dataService.triggerAction('Successfully delete the bic');
      this.router.navigate(['/home'], { queryParams: { id: 'home'} });
    }

    successDivCloseAfterSec(){
      this.successDivVisible = true;
        setTimeout(() => {
          this.successDivVisible = false;
        }, 9000);
    }
    successDivCloseInstant(){
      this.successDivVisible = false;
    }

    setData(){
      this.dataSubscription = this.dataService.navbarData$.subscribe(updatedData => {
        if (updatedData) {
          this.navbarData = updatedData;
          // console.log('Updated Navbar Data:', this.navbarData);
          if (this.navbarData !== undefined && this.navbarData !== null) {

            this.processData(this.navbarData); // Only process if the data is valid
          }
        } else {
          console.warn('No data received or data is null.');
        }       
      });
    }

      // Method to process the formFieldValue array and check for the specific conditions
      processData(data: any) {
        // Ensure the data is valid before accessing it
        if (data && Array.isArray(data) && data.length > 0) {
          this.sortAccordingToDate(data);
          const parsedData = data.map(item => {
            // Parse the session_data string into a JSON object
            const parsedSessionData = JSON.parse(item.session_data);
            
            // Return a new object with the original data plus the parsed session_data
            return {
              session_id: item.session_id,
              user_name: item.user_name,
              session_data: parsedSessionData
            };
          });
          if(parsedData){

            this.modifiedData = parsedData.map((item: any, index: any) => {
              if(item.session_data.formFieldValue !== undefined && item.session_data.formFieldValue !== null){
                
                const ideaTitleObj = item.session_data.formFieldValue.find((f: { label: string; }) => f.label === 'Your idea title');
                let title : any;
                if (ideaTitleObj?.value?.trim() !== ''  && ideaTitleObj?.value?.trim() !== "ADA couldn't fill this field, please continue the conversation to fill it") {
                  title = ideaTitleObj.value
                }else {
                  title = `BIC draft ${index + 1}`;
                }
                // const title = ideaTitleObj?.value?.trim() == "ADA couldn't fill this field, please continue the conversation to fill it"
                //   ? ideaTitleObj.value
                //   : `BIC${index + 1}`;
                
                return {
                  ...item,
                  displayTitle: title // Add new property
                };
              }
            });
            
          }
        } else {
          this.modifiedData = [];
          console.warn('No valid session data available or data is empty.');
        }
        console.log("ModifiedData",this.modifiedData)
      }

    sortAccordingToDate(arr: any){
      arr.sort((a: { timestamp: string | number | Date; }, b: { timestamp: string | number | Date; }) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA; // descending order (latest first)
      });
    }

    // Method to handle the click event when a user clicks on a data item
    onItemClick(item: any, id:any, userName:any, i:any) {
      this.dataService.show();
      setTimeout(() => {
        this.selectedItem = i; // Update the selected item index
        console.log(this.selectedItem, i); // Log to verify the correct value
      }, 0);
      this.isItemSelected = true;
      this.cdr.detectChanges();
      let data = {
        sessionDataDraft: item,
        sessionDataId : id,
        sessionDataUserName: userName,
        comingFrom : "draft"
      }
      this.dataService.setData(data);
      this.router.navigate(['/bic']); // route to detail component
      
    }

    deleteConfirmationBox(username: any,sessionid: any, title:any) {
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

    onHover(index: number): void {
      // this.activeSelectedAtime = index;
      // this.selectedItem = this.activeSelectedAtime;

      
    }
  
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    // this.fetchData();
  }

  showHideDraft(index: number, event: MouseEvent): void {
    event.stopPropagation(); // prevent parent click
    if (this.openedDropdownIndex === index) {
      this.openedDropdownIndex = null; // close if already open
    } else {
      this.openedDropdownIndex = index; // open the clicked one
    }
  }
  // showHideDraft() {
  //   this.isRecentDelete = !this.isRecentDelete;
  // }
  navigateTo(route: string,name:any) {
    // this.router.navigate([route]);
    if(name == 'create'){
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
}
