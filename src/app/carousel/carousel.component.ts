import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONSTANTS } from '../constants';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent implements OnInit {
  userComeFirstTime = true;
  showOnlyPopup: boolean = false;
  totalSlides: number = 0;
  currentSlideIndex: number = 0;
  isLastSlideReached: boolean = false;
  showCarousel = false;
  step = 1;
  isFirstSlide: boolean = false;
  @Output() hideParent = new EventEmitter<void>();

  secondListImages = [
    'title.svg',
    'problem-statement.svg',
    'objective.svg',
    'key-result.svg',
    'key-feature.svg',
    'urgency.svg',
    'area-involved.svg',
    'destination.svg',
    'risk.svg',
  ];

  readonly carouselText = APP_CONSTANTS.CAROUSEL;
  firstTitle = this.carouselText.FIRST_TITLE;
  carouselItems = this.carouselText.LIST_ITEMS;
  firstTitleNo = this.carouselText.FIRST_TITLE_NO;
  firstGuideTitle = this.carouselText.FIRST_GUIDE_TITLE;

  secondTitleNo = this.carouselText.SECOND_TITLE_NO;
  secondGuideTitle = this.carouselText.SECOND_GUIDE_TITLE;
  secondGuideDescription = this.carouselText.SECOND_GUIDE_DESCRIPTION;
  secondListItems = this.carouselText.SECOND_LIST_ITEMS;

  thirdTitleNo = this.carouselText.THIRD_TITLE_NO;
  thirdGuideTitle = this.carouselText.THIRD_GUIDE_TITLE;
  thirdGuideDescription = this.carouselText.THIRD_GUIDE_DESCRIPTION;
  thirdPartOne = this.carouselText.THIRD_PART_ONE;
  thirdPartOneList = this.carouselText.THIRD_PART_ONE_LIST;

  thirdPartTwo = this.carouselText.THIRD_PART_TWO;
  thirdPartTwoList = this.carouselText.THIRD_PART_TWO_LIST;

  thirdPartThree = this.carouselText.THIRD_PART_THREE;
  thirdPartThreeList = this.carouselText.THIRD_PART_THREE_LIST;

  thirdPartFour = this.carouselText.THIRD_PART_FOUR;
  thirdPartFourList = this.carouselText.THIRD_PART_FOUR_LIST;

  fourthTitleNo = this.carouselText.FOURTH_TITLE_NO;
  fourthGuideTitle = this.carouselText.FOURTH_GUIDE_TITLE;
  fourthListOne = this.carouselText.FOURTH_LIST_ONE;
  fourthDontWorry = this.carouselText.FOURTH_DONT_WORRY;
  fourthListTwo = this.carouselText.FOURTH_LIST_TWO;
  previous = this.carouselText.PREVIOUS;
  letMeSkip = this.carouselText.LET_ME_SKIP;
  next = this.carouselText.NEXT;
  getStart = this.carouselText.GET_STARTED;

  constructor(private router: Router) {}

  ngOnInit() {
    if (
      sessionStorage.getItem('userFirstTime') &&
      sessionStorage.getItem('userFirstTime') === 'false'
    ) {
      this.userComeFirstTime = false;
    }
    this.isFirstSlide = this.currentSlideIndex === 0;
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      this.setTotalSlides();
    }, 0);
  }

  goToSlide(index: number) {
    if (index === this.currentSlideIndex) {return;}
    
    const items = document.querySelectorAll('#carouselExampleIndicators .carousel-item');
    const currentActive = document.querySelector('#carouselExampleIndicators .carousel-item.active');
    
    if (currentActive && items[index]) {
      // Start fade out current
      (currentActive as HTMLElement).style.opacity = '0';
      
      setTimeout(() => {
        // Remove active from current
        currentActive.classList.remove('active');
        
        // Add active to target and fade in
        items[index].classList.add('active');
        (items[index] as HTMLElement).style.opacity = '1';
        
        // Update component state
        this.currentSlideIndex = index;
        this.isFirstSlide = index === 0;
        this.isLastSlideReached = index === this.totalSlides - 1;
      }, 250);
    }
  }

  goToNextSlide() {
    if (this.currentSlideIndex < this.totalSlides - 1) {
      this.goToSlide(this.currentSlideIndex + 1);
    }
  }

  goToPreviousSlide() {
    if (this.currentSlideIndex > 0) {
      this.goToSlide(this.currentSlideIndex - 1);
    }
  }
  
  setTotalSlides() {
    const carouselItems = document.querySelectorAll(
      '#carouselExampleIndicators .carousel-item'
    );
    this.totalSlides = carouselItems.length;
  }

  getStarted(): void {
    this.closePopup();
    this.hideParent.emit();
    sessionStorage.setItem('userFirstTime', 'false');
    this.router.navigate(['/create']);
  }

  closePopup(): void {
    this.showCarousel = false;
    this.step = 1;
  }
}