import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CarouselComponent } from './carousel.component';
import { APP_CONSTANTS } from '../constants';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [CarouselComponent],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set userComeFirstTime to false if sessionStorage is false', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('false');
    component.ngOnInit();
    expect(component.userComeFirstTime).toBeFalse();
  });

  it('should set userComeFirstTime to true if sessionStorage is not false', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('true');
    component.ngOnInit();
    expect(component.userComeFirstTime).toBeTrue();
  });

  it('should set isFirstSlide to true when currentSlideIndex is 0', () => {
    component.currentSlideIndex = 0;
    component.ngOnInit();
    expect(component.isFirstSlide).toBeTrue();
  });

  it('should set totalSlides in setTotalSlides', () => {
    const dummyElements = Array(3).fill(document.createElement('div'));
    spyOn(document, 'querySelectorAll').and.returnValue(dummyElements as any);
    component.setTotalSlides();
    expect(component.totalSlides).toBe(3);
  });

  it('should navigate to specific slide in goToSlide', () => {
    // Setup DOM elements
    const mockItems = [
      { classList: { add: jasmine.createSpy(), remove: jasmine.createSpy() }, style: { opacity: '1' } },
      { classList: { add: jasmine.createSpy(), remove: jasmine.createSpy() }, style: { opacity: '0' } },
      { classList: { add: jasmine.createSpy(), remove: jasmine.createSpy() }, style: { opacity: '0' } }
    ];
    const mockCurrentActive = { classList: { remove: jasmine.createSpy() }, style: { opacity: '1' } };
    
    spyOn(document, 'querySelectorAll').and.returnValue(mockItems as any);
    spyOn(document, 'querySelector').and.returnValue(mockCurrentActive as any);
    
    component.totalSlides = 3;
    component.currentSlideIndex = 0;
    
    component.goToSlide(1);
    
    expect(component.currentSlideIndex).toBe(1);
    expect(component.isFirstSlide).toBeFalse();
    expect(component.isLastSlideReached).toBeFalse();
  });

  it('should go to next slide in goToNextSlide', () => {
    spyOn(component, 'goToSlide');
    component.currentSlideIndex = 0;
    component.totalSlides = 3;
    
    component.goToNextSlide();
    
    expect(component.goToSlide).toHaveBeenCalledWith(1);
  });

  it('should go to previous slide in goToPreviousSlide', () => {
    spyOn(component, 'goToSlide');
    component.currentSlideIndex = 2;
    
    component.goToPreviousSlide();
    
    expect(component.goToSlide).toHaveBeenCalledWith(1);
  });

  it('should call closePopup, emit hideParent, set sessionStorage and navigate on getStarted', () => {
    spyOn(component.hideParent, 'emit');
    spyOn(sessionStorage, 'setItem');
    spyOn(component, 'closePopup');
    component.getStarted();
    expect(component.closePopup).toHaveBeenCalled();
    expect(component.hideParent.emit).toHaveBeenCalled();
    expect(sessionStorage.setItem).toHaveBeenCalledWith('userFirstTime', 'false');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/create']);
  });

  it('should close popup and reset step', () => {
    component.showCarousel = true;
    component.step = 2;
    component.closePopup();
    expect(component.showCarousel).toBeFalse();
    expect(component.step).toBe(1);
  });

  it('should update slide states when navigating', () => {
    component.totalSlides = 3;
    
    // Test first slide
    component.currentSlideIndex = 0;
    component.isFirstSlide = component.currentSlideIndex === 0;
    component.isLastSlideReached = component.currentSlideIndex === component.totalSlides - 1;
    
    expect(component.isFirstSlide).toBeTrue();
    expect(component.isLastSlideReached).toBeFalse();

    // Test last slide
    component.currentSlideIndex = 2;
    component.isFirstSlide = component.currentSlideIndex === 0;
    component.isLastSlideReached = component.currentSlideIndex === component.totalSlides - 1;
    
    expect(component.isFirstSlide).toBeFalse();
    expect(component.isLastSlideReached).toBeTrue();
  });
});
