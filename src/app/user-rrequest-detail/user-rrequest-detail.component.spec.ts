import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRRequestDetailComponent } from './user-rrequest-detail.component';

describe('UserRRequestDetailComponent', () => {
  let component: UserRRequestDetailComponent;
  let fixture: ComponentFixture<UserRRequestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRRequestDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
