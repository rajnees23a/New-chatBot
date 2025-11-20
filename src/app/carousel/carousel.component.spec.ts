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

  it('should update isLastSlideReached and isFirstSlide in goToSlide', () => {
    // Create mock DOM elements
    const mockItems = [
      { classList: { add: jasmine.createSpy(), remove: jasmine.createSpy() }, style: {} },
      { classList: { add: jasmine.createSpy(), remove: jasmine.createSpy() }, style: {} },
      { classList: { add: jasmine.createSpy(), remove: jasmine.createSpy() }, style: {} }
    ];
    const mockActive = mockItems[0];
    mockActive.classList.add('active');
    
    spyOn(document, 'querySelectorAll').and.returnValue(mockItems as any);
    spyOn(document, 'querySelector').and.returnValue(mockActive as any);

    component.totalSlides = 3;
    component.currentSlideIndex = 0;
    
    // Wait for setTimeout
    jasmine.clock().install();
    // Go to last slide
    component.goToSlide(2);
    jasmine.clock().tick(300);
    
    expect(component.currentSlideIndex).toBe(2);
    expect(component.isFirstSlide).toBeFalse();
    expect(component.isLastSlideReached).toBeTrue();
    
    jasmine.clock().uninstall();
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

  it('should navigate to next slide when goToNextSlide is called', () => {
    const mockItems = [
      { classList: { add: jasmine.createSpy(), remove: jasmine.createSpy() }, style: {} },
      { classList: { add: jasmine.createSpy(), remove: jasmine.createSpy() }, style: {} }
    ];
    mockItems[0].classList.add('active');
    
    spyOn(document, 'querySelectorAll').and.returnValue(mockItems as any);
    spyOn(document, 'querySelector').and.returnValue(mockItems[0] as any);
    
    component.totalSlides = 2;
    component.currentSlideIndex = 0;
    
    jasmine.clock().install();
    component.goToNextSlide();
    jasmine.clock().tick(300);
    
    expect(component.currentSlideIndex).toBe(1);
    
    jasmine.clock().uninstall();
  });
  
  it('should navigate to previous slide when goToPreviousSlide is called', () => {
    const mockItems = [
      { classList: { add: jasmine.createSpy(), remove: jasmine.createSpy() }, style: {} },
      { classList: { add: jasmine.createSpy(), remove: jasmine.createSpy() }, style: {} }
    ];
    mockItems[1].classList.add('active');
    
    spyOn(document, 'querySelectorAll').and.returnValue(mockItems as any);
    spyOn(document, 'querySelector').and.returnValue(mockItems[1] as any);
    
    component.totalSlides = 2;
    component.currentSlideIndex = 1;
    
    jasmine.clock().install();
    component.goToPreviousSlide();
    jasmine.clock().tick(300);
    
    expect(component.currentSlideIndex).toBe(0);
    expect(component.isFirstSlide).toBeTrue();
    
    jasmine.clock().uninstall();
  });
});
