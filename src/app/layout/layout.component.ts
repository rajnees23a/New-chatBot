import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SerrviceService } from '../serrvice.service'; // Import the DataService
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  isCollapsed = false;
  successDivVisible = false;
  showSuccessMessage = false;
  private actionSubscription: Subscription = new Subscription();
  private routeSubscription: Subscription = new Subscription();
  currentRoute = '';
  message: string = '';
  isMobile = window.innerWidth < 576;
  isTablet = window.innerWidth >= 576 && window.innerWidth < 992;
  isLaptop = window.innerWidth >= 992 && window.innerWidth < 1200;
  isDesktop = window.innerWidth >= 1200 && window.innerWidth < 1400;
  constructor(
    private router: Router,
    private dataService: SerrviceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.actionSubscription = this.dataService.action$.subscribe(
      ({ message, triggered }) => {
        this.message = message;
        this.showSuccessMessage = triggered;
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 5000);
      }
    );
  }

  successDivCloseInstant(): void {
    this.showSuccessMessage = false;
    this.dataService.resetAction();
  }

  ngOnDestroy(): void {
    this.actionSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }
}
