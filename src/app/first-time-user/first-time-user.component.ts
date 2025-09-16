import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_CONSTANTS } from '../constants';

@Component({
  selector: 'app-first-time-user',
  templateUrl: './first-time-user.component.html',
  styleUrls: ['./first-time-user.component.css']
})
export class FirstTimeUserComponent implements OnInit {

  staticText = APP_CONSTANTS.First_Time_User;
  @Output() booleanValue: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() childData: string = '';
  createNew: boolean = true;
  isPopupVisible: boolean = false;
  userComeFirstTime = true;
  currentStep: number = 1;
  comingFromCreatDirectly: boolean = false;
  showOnlyPopup: boolean = false;
  isLastSlideReached: boolean = false;
  totalSlides: number = 0;
  currentSlideIndex: number = 0;
  showCarousel = false;

  constructor(private route: ActivatedRoute, private router: Router) {

  }
  

  ngOnInit() {
    if (sessionStorage.getItem('userFirstTime') && sessionStorage.getItem('userFirstTime') == 'false') {
      this.userComeFirstTime = false;
    }
  }

  openPopup(): void {
    if (this.userComeFirstTime == true) {
      this.showCarousel = true;
    } else {
      this.router.navigate(['/create']);
    }
  }

  openPopupOnClick(): void {
    this.showOnlyPopup = true;
  }
}
