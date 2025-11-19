import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CarouselComponent } from './carousel.component';

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

  it('should set isLastSlideReached and isFirstSlide in checkIfLastSlide', () => {
    const addEventListenerSpy = jasmine.createSpy('addEventListener');
    spyOn(document, 'getElementById').and.returnValue({
      addEventListener: addEventListenerSpy
    } as any);

    component.totalSlides = 5;
    component.currentSlideIndex = 4;
    (component as any).checkIfLastSlide();

    // Simulate event callback
    const event = { to: 4 };
    addEventListenerSpy.calls.argsFor(0)[1](event);

    expect(component.currentSlideIndex).toBe(4);
    expect(component.isFirstSlide).toBeFalse();
    expect(component.isLastSlideReached).toBeTrue();
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

  it('should update slide states in onCarouselSlide', () => {
    spyOn(component, 'setTotalSlides');
    spyOn(component as any, 'checkIfLastSlide');
    component.currentSlideIndex = 0;
    component.isLastSlideReached = false;
    (component as any).onCarouselSlide();
    expect(component.setTotalSlides).toHaveBeenCalled();
    expect((component as any).checkIfLastSlide).toHaveBeenCalled();
    expect(component.isFirstSlide).toBeTrue();

    component.currentSlideIndex = 1;
    component.isLastSlideReached = true;
    (component as any).onCarouselSlide();
    expect(component.isFirstSlide).toBeFalse();
  });
});
