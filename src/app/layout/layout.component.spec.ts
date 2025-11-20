import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ServiceService } from '../service.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockService: jasmine.SpyObj<ServiceService>;
  let actionSubject: Subject<{ message: string, triggered: boolean }>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], { snapshot: {} });
    actionSubject = new Subject<{ message: string, triggered: boolean }>();
    mockService = jasmine.createSpyObj('ServiceService', ['resetAction'], { action$: actionSubject.asObservable() });

    await TestBed.configureTestingModule({
      declarations: [LayoutComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ServiceService, useValue: mockService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]   // ✅ ignore <app-left-nav> and other unknown elements
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe and update message & showSuccessMessage on ngOnInit', fakeAsync(() => {
    const testMessage = { message: 'Success!', triggered: true };

    actionSubject.next(testMessage);
    tick(); // simulate async

    expect(component.message).toBe('Success!');
    expect(component.showSuccessMessage).toBeTrue();

    tick(5000); // simulate timeout
    expect(component.showSuccessMessage).toBeFalse();
  }));

  it('should close success div instantly and call resetAction', () => {
    component.showSuccessMessage = true;

    component.successDivCloseInstant();

    expect(component.showSuccessMessage).toBeFalse();
    expect(mockService.resetAction).toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy1 = spyOn(component['actionSubscription'], 'unsubscribe');
    const unsubscribeSpy2 = spyOn(component['routeSubscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(unsubscribeSpy1).toHaveBeenCalled();
    expect(unsubscribeSpy2).toHaveBeenCalled();
  });
});
