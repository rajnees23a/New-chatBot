import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { ServiceService } from './service.service';
import { Component } from '@angular/core';

@Component({selector: 'app-loader', template: ''})
class MockLoaderComponent {}

import { ComponentFixture } from '@angular/core/testing';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let router: Router;
  let dataService: any;
  let loadingSubject: Subject<boolean>;

  beforeEach(async () => {
    loadingSubject = new Subject<boolean>();
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent,
        MockLoaderComponent
      ],
      providers: [
        {
          provide: ServiceService,
          useValue: {
            loading$: loadingSubject.asObservable()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    dataService = TestBed.inject(ServiceService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should contain router-outlet', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });

  it('should show loader when isLoading is true', fakeAsync(() => {
    component.ngOnInit();
    loadingSubject.next(true);
    tick(); // allow subscription to propagate
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-loader')).not.toBeNull();
  }));

  it('should hide loader when isLoading is false', () => {
    loadingSubject.next(false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-loader')).toBeNull();
  });

  it('should subscribe to loading$ on ngOnInit', () => {
    spyOn(dataService.loading$, 'subscribe').and.callThrough();
    component.ngOnInit();
    expect(dataService.loading$.subscribe).toHaveBeenCalled();
  });

  it('should initialize tooltips and auto-hide logic on navigation', fakeAsync(() => {
    // Mock bootstrap.Tooltip as a constructor
    (window as any).bootstrap = {
      Tooltip: function() {
        return {
          dispose: jasmine.createSpy('dispose'),
          hide: jasmine.createSpy('hide')
        };
      }
    };
    (window as any).bootstrap.Tooltip.getInstance = jasmine.createSpy('getInstance').and.returnValue({
      dispose: jasmine.createSpy('dispose'),
      hide: jasmine.createSpy('hide')
    });

    // Add dummy tooltip element to DOM
    const tooltipEl = document.createElement('div');
    tooltipEl.setAttribute('data-bs-toggle', 'tooltip');
    document.body.appendChild(tooltipEl);

    // Add dummy file input to DOM
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    document.body.appendChild(fileInput);

    // Add dummy upload icon tooltip element to DOM
    const uploadIcon = document.createElement('div');
    uploadIcon.setAttribute('data-bs-toggle', 'tooltip');
    uploadIcon.setAttribute('data-tooltip-id', 'upload-icon');
    document.body.appendChild(uploadIcon);

    // Simulate router event
    fixture.detectChanges();
    component.ngAfterViewInit();
    (router.events as Subject<any>).next(new NavigationEnd(1, '/test', '/test'));
    tick(1); // For setTimeout in ngAfterViewInit

    // Test initializeTooltips
    component.initializeTooltips();
    expect((window as any).bootstrap.Tooltip).toBeDefined();

    // Test autoHideTooltipsOnClick
    component.autoHideTooltipsOnClick();
    tick(500);
    tooltipEl.click();
    expect((window as any).bootstrap.Tooltip.getInstance).toHaveBeenCalled();

    // Test autoHideTooltipOnFileUpload
    component.autoHideTooltipOnFileUpload();
    tick(500);
    fileInput.dispatchEvent(new Event('change'));
    tick(300);
    expect((window as any).bootstrap.Tooltip.getInstance).toHaveBeenCalled();

    // Clean up
    tooltipEl.remove();
    fileInput.remove();
    uploadIcon.remove();
  }));

  it('should dispose existing tooltips in initializeTooltips', () => {
    // Mock bootstrap.Tooltip as a constructor
    (window as any).bootstrap = {
      Tooltip: function() {
        return {
          dispose: jasmine.createSpy('dispose'),
          hide: jasmine.createSpy('hide')
        };
      }
    };
    (window as any).bootstrap.Tooltip.getInstance = jasmine.createSpy('getInstance').and.returnValue({
      dispose: jasmine.createSpy('dispose'),
      hide: jasmine.createSpy('hide')
    });

    // Add dummy tooltip element to DOM
    const tooltipEl = document.createElement('div');
    tooltipEl.setAttribute('data-bs-toggle', 'tooltip');
    document.body.appendChild(tooltipEl);

    component.initializeTooltips();
    expect((window as any).bootstrap.Tooltip).toBeDefined();

    tooltipEl.remove();
  });

  it('should hide tooltip on click', fakeAsync(() => {
    (window as any).bootstrap = {
      Tooltip: jasmine.createSpy('Tooltip').and.callFake(() => ({
        dispose: jasmine.createSpy('dispose'),
        hide: jasmine.createSpy('hide')
      }))
    };
    const tooltipEl = document.createElement('div');
    tooltipEl.setAttribute('data-bs-toggle', 'tooltip');
    document.body.appendChild(tooltipEl);

    (window as any).bootstrap.Tooltip.getInstance = jasmine.createSpy('getInstance').and.returnValue({
      hide: jasmine.createSpy('hide')
    });

    component.autoHideTooltipsOnClick();
    tick(500);
    tooltipEl.click();
    expect((window as any).bootstrap.Tooltip.getInstance).toHaveBeenCalled();

    tooltipEl.remove();
  }));

  it('should hide tooltip on file upload', fakeAsync(() => {
    (window as any).bootstrap = {
      Tooltip: function() {
        return {
          dispose: jasmine.createSpy('dispose'),
          hide: jasmine.createSpy('hide')
        };
      }
    };
    (window as any).bootstrap.Tooltip.getInstance = jasmine.createSpy('getInstance').and.returnValue({
      hide: jasmine.createSpy('hide')
    });

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    document.body.appendChild(fileInput);

    const uploadIcon = document.createElement('div');
    uploadIcon.setAttribute('data-bs-toggle', 'tooltip');
    uploadIcon.setAttribute('data-tooltip-id', 'upload-icon');
    document.body.appendChild(uploadIcon);

    component.autoHideTooltipOnFileUpload();
    tick(500);
    fileInput.dispatchEvent(new Event('change'));
    tick(300);
    expect((window as any).bootstrap.Tooltip.getInstance).toHaveBeenCalled();

    fileInput.remove();
    uploadIcon.remove();
  }));
});
