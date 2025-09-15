import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { APP_CONSTANTS } from '../../constants';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display app title from constants', () => {
    expect(component.appTitle).toBe(APP_CONSTANTS.HEADER.APP_TITLE);
  });

  it('should display user initials from constants', () => {
    expect(component.userInitials).toBe(APP_CONSTANTS.HEADER.USER_INITIALS);
  });
});