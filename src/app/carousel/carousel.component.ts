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

  constructor(private router: Router) {}

  ngOnInit() {
    if (
      sessionStorage.getItem('userFirstTime') &&
      sessionStorage.getItem('userFirstTime') == 'false'
    ) {
      this.userComeFirstTime = false;
    }
    this.isFirstSlide = this.currentSlideIndex === 0;
    this.setTotalSlides();
    // this.checkIfLastSlide();
  }

  // hideChild() {
  //   this.hideParent.emit();
  // }

  setTotalSlides() {
    const carouselItems = document.querySelectorAll(
      '#carouselExampleIndicators .carousel-item'
    );

    this.totalSlides = carouselItems.length;
    console.log('total', this.totalSlides);
  }

  checkIfLastSlide() {
    const carousel = document.getElementById(
      'carouselExampleIndicators'
    ) as any;
    if (carousel) {
      carousel.addEventListener('slid.bs.carousel', (event: any) => {
        this.currentSlideIndex = event.to; // Update the current slide index
        this.isFirstSlide = this.currentSlideIndex === 0; // Set isFirstSlide flag
        this.isLastSlideReached =
          this.currentSlideIndex === this.totalSlides - 1; // Check for last slide
        console.log(
          'Slide changed, first slide:',
          this.isFirstSlide,
          'last slide:',
          this.isLastSlideReached
        );
      });
    }
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

  onCarouselSlide() {
    this.setTotalSlides();
    this.checkIfLastSlide();
    console.log('checkingSlides-----------', this.currentSlideIndex);

    this.isFirstSlide = this.currentSlideIndex === 0;

    console.log('Next button clicked!');
    // For example, check if it’s the last slide and show some message.
    if (this.isLastSlideReached == true) {
      console.log('You are on the last slide');
    }
    // console.log("mmmmm",event.target.children.length);
  }
}
