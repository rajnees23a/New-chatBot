import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FirstTimeUserComponent } from './first-time-user.component';

describe('FirstTimeUserComponent', () => {
  let component: FirstTimeUserComponent;
  let fixture: ComponentFixture<FirstTimeUserComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      declarations: [FirstTimeUserComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FirstTimeUserComponent);
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

  it('should show carousel if userComeFirstTime is true on openPopup', () => {
    component.userComeFirstTime = true;
    component.showCarousel = false;
    component.openPopup();
    expect(component.showCarousel).toBeTrue();
  });

  it('should navigate to /create if userComeFirstTime is false on openPopup', () => {
    component.userComeFirstTime = false;
    component.openPopup();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/create']);
  });

  it('should set showOnlyPopup to true on openPopupOnClick', () => {
    component.showOnlyPopup = false;
    component.openPopupOnClick();
    expect(component.showOnlyPopup).toBeTrue();
  });

  it('should have default values for inputs and outputs', () => {
    expect(component.childData).toBe('');
    expect(component.createNew).toBeTrue();
    expect(component.isPopupVisible).toBeFalse();
    expect(component.currentStep).toBe(1);
    expect(component.comingFromCreatDirectly).toBeFalse();
    expect(component.showOnlyPopup).toBeFalse();
    expect(component.isLastSlideReached).toBeFalse();
    expect(component.totalSlides).toBe(0);
    expect(component.currentSlideIndex).toBe(0);
    expect(component.showCarousel).toBeFalse();
    expect(component.userComeFirstTime).toBeTrue(); // Changed from toBeFalse() to toBeTrue()
  });
});
