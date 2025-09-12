import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeftNavComponent } from './left-nav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SerrviceService } from '../../serrvice.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import * as bootstrap from 'bootstrap';

describe('LeftNavComponent', () => {
  let component: LeftNavComponent;
  let fixture: ComponentFixture<LeftNavComponent>;

  beforeEach(async () => {
    spyOn(document, 'addEventListener').and.callFake(() => {});
    spyOn(document, 'removeEventListener').and.callFake(() => {});

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [LeftNavComponent],
      providers: [
        {
          provide: SerrviceService,
          useValue: {
            userName: 'test',
            retriveData: () => {},
            navbarData$: { subscribe: () => ({}) },
            deletDraftData: () => {},
            triggerAction: () => {},
            setData: () => {},
            show: () => {}
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LeftNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit

     component['routerSubscription'] = { unsubscribe: jasmine.createSpy('unsubscribe') } as any;
  component.dataSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should process data and set modifiedData correctly', () => {
  const mockData = [{
    session_id: '123',
    user_name: 'user',
    timestamp: new Date().toISOString(),
    session_data: JSON.stringify({
      formFieldValue: [{ label: component.navText.YOUR_IDEA_TITLE, value: 'My Idea' }]
    })
  }];

  component['dataService'].navbarData$ = of(mockData);
  component.setData();

  expect(component.modifiedData[0].displayTitle).toBe('My Idea');
});

  it('should call fetchDraftData on init', () => {
    spyOn(component, 'fetchDraftData');
    component.ngOnInit();
    expect(component.fetchDraftData).toHaveBeenCalled();
  });

  it('should set deleteConfirmTitle correctly', () => {
    component.deletingTitle = 'Test';
    expect(component.deleteConfirmTitle).toContain('Test');
  });
  it('should call dataService.deletDraftData and fetchDraftData on deleteDraft', () => {
  const deletDraftDataSpy = spyOn(component['dataService'], 'deletDraftData');
  const fetchDraftDataSpy = spyOn(component, 'fetchDraftData');
  const triggerActionSpy = spyOn(component['dataService'], 'triggerAction');
  const navigateSpy = spyOn(component['router'], 'navigate');

  component.deletingUserNAme = 'user';
  component.deleteingSesionId = 'id';
  component.deleteDraft();

  expect(deletDraftDataSpy).toHaveBeenCalled();
  expect(fetchDraftDataSpy).toHaveBeenCalled();
  expect(triggerActionSpy).toHaveBeenCalled();
  expect(navigateSpy).toHaveBeenCalled();
});

it('should set modifiedData to [] when data is empty', () => {
  component.processData([]);
  expect(component.modifiedData).toEqual([]);
});

it('should fallback to BIC draft when title is empty', () => {
  const mockData = [{
    session_id: '123',
    user_name: 'user',
    timestamp: new Date().toISOString(),
    session_data: JSON.stringify({
      formFieldValue: [{ label: component.navText.YOUR_IDEA_TITLE, value: '' }]
    })
  }];
  component.processData(mockData);
  expect(component.modifiedData[0].displayTitle).toContain('BIC draft');
});

it('should sort data by timestamp descending', () => {
  const arr = [
    { timestamp: '2020-01-01' },
    { timestamp: '2023-01-01' }
  ];
  component.sortAccordingToDate(arr);
  expect(arr[0].timestamp).toBe('2023-01-01');
});

it('should handle item click and navigate', fakeAsync(() => {
  const showSpy = spyOn(component['dataService'], 'show');
  const setDataSpy = spyOn(component['dataService'], 'setData');
  const navigateSpy = spyOn(component['router'], 'navigate');

  component.onItemClick({ test: 1 }, 'id', 'user', 0);
  tick(); // flush setTimeout

  expect(showSpy).toHaveBeenCalled();
  expect(component.selectedItem).toBe(0);
  expect(setDataSpy).toHaveBeenCalled();
  expect(navigateSpy).toHaveBeenCalledWith(['/bic']);
}));

it('should open bootstrap modal on deleteConfirmationBox', () => {
  const modalElement = document.createElement('div');
  spyOn(document, 'getElementById').and.returnValue(modalElement);
  const modalShowSpy = jasmine.createSpy('show');
  spyOn(bootstrap as any, 'Modal').and.returnValue({ show: modalShowSpy });

  component.deleteConfirmationBox('user', 'id', 'title');
  expect(modalShowSpy).toHaveBeenCalled();
});

it('should close dropdown on outside click', () => {
  component.openedDropdownIndex = 1;
  component.closeDropdownOnClickOutside(new MouseEvent('click'));
  expect(component.openedDropdownIndex).toBeNull();
});

it('should toggle sidebar state', () => {
  component.isCollapsed = false;
  component.toggleSidebar();
  expect(component.isCollapsed).toBeTrue();
});

it('should toggle dropdown index', () => {
  const event = new MouseEvent('click');
  spyOn(event, 'stopPropagation');
  component.showHideDraft(1, event);
  expect(component.openedDropdownIndex).toBe(1);

  component.showHideDraft(1, event);
  expect(component.openedDropdownIndex).toBeNull();
  expect(event.stopPropagation).toHaveBeenCalled();
});

it('should navigate to create with refresh if already on /create', fakeAsync(() => {
  spyOnProperty(component['router'], 'url').and.returnValue('/create');
  const navigateByUrlSpy = spyOn(component['router'], 'navigateByUrl').and.returnValue(Promise.resolve(true));
  const navigateSpy = spyOn(component['router'], 'navigate');

  component.navigateTo('/create', 'create');
  tick();
  expect(navigateByUrlSpy).toHaveBeenCalled();
  expect(navigateSpy).toHaveBeenCalledWith(['/create']);
}));

it('should navigate normally when not create', () => {
  const navigateSpy = spyOn(component['router'], 'navigate');
  component.navigateTo('/home', 'home');
  expect(navigateSpy).toHaveBeenCalledWith(['/home']);
});

it('should clean up subscriptions and listeners on destroy', () => {
  const unsubSpy1 = spyOn(component['routerSubscription'], 'unsubscribe');
  const unsubSpy2 = spyOn(component.dataSubscription, 'unsubscribe');
  const removeSpy = spyOn(document, 'removeEventListener');

  component.ngOnDestroy();
  expect(unsubSpy1).toHaveBeenCalled();
  expect(unsubSpy2).toHaveBeenCalled();
  expect(removeSpy).toHaveBeenCalled();
});

it('should set successDivVisible to true and then false after timeout', fakeAsync(() => {
  component.successDivCloseAfterSec();
  expect(component.successDivVisible).toBeTrue();
  tick(9000);
  expect(component.successDivVisible).toBeFalse();
}));

it('should set successDivVisible to false instantly', () => {
  component.successDivVisible = true;
  component.successDivCloseInstant();
  expect(component.successDivVisible).toBeFalse();
});
});