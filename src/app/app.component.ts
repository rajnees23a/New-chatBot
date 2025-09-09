import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SerrviceService } from './serrvice.service';
declare var bootstrap: any;


@Component({
  selector: 'app-root', 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'chat-bot';
  isLoading = false;
  readonly router: Router;
  readonly dataService: SerrviceService;

  constructor(router: Router, dataService: SerrviceService) {
    this.router = router;
    this.dataService = dataService;
  }

  ngOnInit() {
    this.dataService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  ngAfterViewInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this.initializeTooltips();
          this.autoHideTooltipsOnClick();
          this.autoHideTooltipOnFileUpload();
        }, 0);
      });
  }

  initializeTooltips() {
    // Dispose existing tooltips first
    const existingTooltips = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    existingTooltips.forEach((el: any) => {
      const instance = bootstrap.Tooltip.getInstance(el);
      if (instance) {
        instance.dispose();
      }
    });

    // Re-initialize all tooltips
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl: Element) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  autoHideTooltipsOnClick() {
    setTimeout(() => {
      document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
        el.addEventListener('click', () => {
          const instance = bootstrap.Tooltip.getInstance(el as Element);
          if (instance) {
            instance.hide();
          }
        });
      });
    }, 500); // Add a slight delay to allow tooltips to initialize
  }

  autoHideTooltipOnFileUpload() {
    setTimeout(() => {
      const fileInput = document.querySelector('[type="file"]');
      if (fileInput) {
        fileInput.addEventListener('change', () => {
          // Wait a bit for UI to update with the file name etc.
          setTimeout(() => {
            const el = document.querySelector('[data-bs-toggle="tooltip"][data-tooltip-id="upload-icon"]'); // use custom selector or unique ID if needed
            if (el) {
              const instance = bootstrap.Tooltip.getInstance(el as Element);
              if (instance) instance.hide();
            }
          }, 300); // Delay gives enough time for DOM update
        });
      }
    }, 500);
  }
  
}

