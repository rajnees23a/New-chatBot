import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserRequestComponent } from './user-request.component';
import { SerrviceService } from '../serrvice.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UserRequestComponent', () => {
  let component: UserRequestComponent;
  let fixture: ComponentFixture<UserRequestComponent>;
  let mockService: jasmine.SpyObj<SerrviceService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('SerrviceService', [
      'getRequestData',
      'show',
      'setDataForRequestChatShow'
    ], { userName: 'testUser' });

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // ✅ Provide default safe return value for getRequestData
    mockService.getRequestData.and.returnValue(of({ my_request_submitted_data: { sessions: [] } }));

    await TestBed.configureTestingModule({
      declarations: [UserRequestComponent],
      providers: [
        { provide: SerrviceService, useValue: mockService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UserRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // calls ngOnInit -> fetchData
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('getStatusStyle', () => {
    it('should return Approved style', () => {
      const style = component.getStatusStyle('Approved');
      expect(style['background-color']).toBe('#198754');
      expect(style.color).toBe('#fff');
    });

    it('should return Feedback style', () => {
      const style = component.getStatusStyle('Feedback');
      expect(style['background-color']).toBe('#ffc107');
    });

    it('should return Pending_review style', () => {
      const style = component.getStatusStyle('Pending_review');
      expect(style['background-color']).toBe('#E6F0FF');
    });

    it('should return Pending-review style', () => {
      const style = component.getStatusStyle('Pending-review');
      expect(style['background-color']).toBe('#E6F0FF');
    });

    it('should return default style for unknown status', () => {
      const style = component.getStatusStyle('Other');
      expect(style['background-color']).toBe('#f0f0f0');
    });
  });

  describe('fetchData', () => {
    it('should populate requestData correctly from API response', () => {
      const mockResponse = {
        my_request_submitted_data: {
          sessions: [
            { Submitteddate: '2025-09-24 12:00:00' }
          ]
        }
      };
      mockService.getRequestData.and.returnValue(of(mockResponse));

      component.fetchData();

      expect(mockService.getRequestData).toHaveBeenCalled();
      expect(component.requestData.length).toBe(1);
      expect(component.requestData[0].Submitteddate).toBe('2025-09-24');
    });

    it('should handle missing or invalid sessions array', () => {
      const mockResponse = { my_request_submitted_data: { sessions: null } };
      mockService.getRequestData.and.returnValue(of(mockResponse));

      component.fetchData();

      expect(component.requestData).toEqual([]);
    });
  });

  describe('onClickRequestID', () => {
    it('should call service methods and navigate after timeout', fakeAsync(() => {
      const testId = '123';
      const testUser = 'testUser';
      const testReqId = 'req001';

      component.onClickRequestID(testId, testUser, testReqId);

      expect(mockService.show).toHaveBeenCalled();
      expect(mockService.setDataForRequestChatShow).toHaveBeenCalledWith({
        sessionDataId: testId,
        sessionDataUserName: testUser
      });

      tick(1000); // simulate delay
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/requestDetail', testReqId]);
    }));
  });
});
