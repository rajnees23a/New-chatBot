import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeftNavComponent } from './left-nav.component';
import { Router } from '@angular/router';
import { SerrviceService } from '../../serrvice.service';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { fakeAsync, tick } from '@angular/core/testing';

describe('LeftNavComponent', () => {
  let component: LeftNavComponent;
  let fixture: ComponentFixture<LeftNavComponent>;
  let mockRouter: any;
  let mockService: any;
  let mockCdr: any;

  beforeEach(async () => {
    mockRouter = {
      events: of(),
      navigate: jasmine.createSpy('navigate'),
      navigateByUrl: jasmine.createSpy('navigateByUrl'),
      url: '/home'
    };
    mockService = {
      userName: 'testUser',
      retriveData: jasmine.createSpy('retriveData'),
      deletDraftData: jasmine.createSpy('deletDraftData'),
      triggerAction: jasmine.createSpy('triggerAction'),
      setData: jasmine.createSpy('setData'),
      show: jasmine.createSpy('show'),
      navbarData$: of([]),
    };
    mockCdr = { detectChanges: jasmine.createSpy('detectChanges') };

    // Mock bootstrap.Modal
    (window as any).bootstrap = {
      Modal: function() {
        return { show: jasmine.createSpy('show') };
      }
    };

    await TestBed.configureTestingModule({
      declarations: [LeftNavComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: SerrviceService, useValue: mockService },
        { provide: ChangeDetectorRef, useValue: mockCdr }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LeftNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar', () => {
    expect(component.isCollapsed).toBe(false);
    component.toggleSidebar();
    expect(component.isCollapsed).toBe(true);
    component.toggleSidebar();
    expect(component.isCollapsed).toBe(false);
  });

  it('should call setData on ngOnInit', () => {
    spyOn(component, 'setData');
    component.ngOnInit();
    expect(component.setData).toHaveBeenCalled();
  });

  it('should set selectedItem on onItemClick', fakeAsync(() => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.onItemClick({}, 'sessionId', 'userName', 2);
    tick(); // advances the virtual timer so setTimeout runs

    expect(component.selectedItem).toBe(2);
    expect(component.isItemSelected).toBe(true);
    expect(mockService.setData).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/bic']);
  }));

  it('should show and hide successDiv', () => {
    component.successDivCloseAfterSec();
    expect(component.successDivVisible).toBeTrue();
    component.successDivCloseInstant();
    expect(component.successDivVisible).toBeFalse();
  });

  it('should set deleting info and show modal on deleteConfirmationBox', () => {
    // Mock a real-like HTMLElement
    const mockModalElement = document.createElement('div');
    spyOn(document, 'getElementById').and.returnValue(mockModalElement);

    // Mock bootstrap.Modal to avoid errors
    (window as any).bootstrap = {
      Modal: function() {
        return { show: jasmine.createSpy('show') };
      }
    };

    component.deleteConfirmationBox('user', 'session', 'title');
    expect(component.deletingUserNAme).toBe('user');
    expect(component.deleteingSesionId).toBe('session');
    expect(component.deletingTitle).toBe('title');
  });

  it('should unsubscribe on ngOnDestroy', () => {
    spyOn(component.routerSubscription, 'unsubscribe');
    spyOn(component.dataSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.routerSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.dataSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should fetch draft data and call retriveData and setData', () => {
    spyOn(component, 'setData');
    component.fetchDraftData();
    expect(mockService.retriveData).toHaveBeenCalledWith({ user_name: mockService.userName });
    expect(component.setData).toHaveBeenCalled();
  });

  it('should delete draft and navigate to home', () => {
    component.deletingUserNAme = 'user';
    component.deleteingSesionId = 'session';
    spyOn(component, 'fetchDraftData');
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.deleteDraft();
    expect(mockService.deletDraftData).toHaveBeenCalledWith({ user_name: 'user', session_id: 'session' });
    expect(component.fetchDraftData).toHaveBeenCalled();
    expect(mockService.triggerAction).toHaveBeenCalledWith(component.navText.DELETE_SUCCESS);
    expect(router.navigate).toHaveBeenCalledWith(['/home'], { queryParams: { id: 'home' } });
  });

  it('should processData with valid and invalid data', () => {
    const validData = [{}, {}];
    spyOn(component, 'sortAccordingToDate');
    component.processData(validData);
    expect(component.sortAccordingToDate).toHaveBeenCalledWith(validData);

    component.processData(null); // should hit else branch
    // No error expected
  });

  it('should handle processData else branch', () => {
    spyOn(component, 'sortAccordingToDate');
    component.processData([]); // empty array triggers else branch
    expect(component.sortAccordingToDate).not.toHaveBeenCalled();
  });

  it('should sort array according to date', () => {
    const arr = [
      { timestamp: '2023-01-01' },
      { timestamp: '2024-01-01' }
    ];
    component.sortAccordingToDate(arr);
    expect(arr[0].timestamp).toBe('2024-01-01'); // newest first
    expect(arr[1].timestamp).toBe('2023-01-01'); // oldest last
  });

  it('should showHideDraft and set openedDropdownIndex', () => {
    const event = new MouseEvent('click');
    component.showHideDraft(1, event);
    expect(component.openedDropdownIndex).toBe(1);
  });

  it('should navigate to route', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    component.navigateTo('/home', 'home');
    expect(router.navigate).toHaveBeenCalledWith(['/home'], { queryParams: { id: 'home' } });
  });

  it('should close dropdown on click outside', () => {
    component.openedDropdownIndex = 1;
    const event = new MouseEvent('click');
    component.closeDropdownOnClickOutside(event);
    // Should set openedDropdownIndex to null
    expect(component.openedDropdownIndex).toBeNull();
  });

  it('should toggle sidebar', () => {
    component.isCollapsed = false;
    component.toggleSidebar();
    expect(component.isCollapsed).toBe(true);
    component.toggleSidebar();
    expect(component.isCollapsed).toBe(false);
  });

  it('should return correct deleteConfirmTitle', () => {
    component.deletingTitle = 'DraftTitle';
    expect(component.deleteConfirmTitle).toContain('DraftTitle');
  });
});