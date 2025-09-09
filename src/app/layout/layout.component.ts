import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SerrviceService } from '../serrvice.service';  // Import the DataService
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {


  isCollapsed = false; // Track navbar state
  successDivVisible = false;
  showSuccessMessage = false;
  private actionSubscription : Subscription = new Subscription;
  private routeSubscription:  Subscription = new Subscription;
  currentRoute = "";
  message: string = '';

  constructor(private router: Router, private dataService: SerrviceService, private route: ActivatedRoute) {}

  ngOnInit(){
    // Subscribe to action changes from the service
    this.actionSubscription = this.dataService.action$.subscribe(({ message, triggered }) => {
      this.message = message;
      this.showSuccessMessage = triggered;
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 5000);
    });

    // Subscribe to route changes
    // this.routeSubscription = this.router.events.subscribe(() => {
    //   this.currentRoute = this.router.url;
    //   this.showSuccessMessage = false; // Reset success message when route changes
    // });
  }

  toggleNavbar(isCollapsed: boolean) {
    this.isCollapsed = isCollapsed; // Update state when navbar toggles
  }  

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.actionSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  successDivCloseInstant(): void {
    this.showSuccessMessage = false;
    this.dataService.resetAction(); // Reset action after closing
  }
}

