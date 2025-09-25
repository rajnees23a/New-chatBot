import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserRRequestDetailComponent } from './user-rrequest-detail.component';
import { ActivatedRoute } from '@angular/router';
import { SerrviceService } from '../serrvice.service';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UserRRequestDetailComponent', () => {
  let component: UserRRequestDetailComponent;
  let fixture: ComponentFixture<UserRRequestDetailComponent>;
  let mockService: jasmine.SpyObj<SerrviceService>;
  let mockActivatedRoute: any;
  let chatDetails$: Subject<any>;

  beforeEach(async () => {
    chatDetails$ = new Subject<any>();

    mockService = jasmine.createSpyObj('SerrviceService', [
      'getRequestData',
      'getRequestChatData',
      'hide',
      'show',
      'setData'
    ], { userName: 'testUser', chatDetailsForRequest$: chatDetails$.asObservable() });

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => key === 'id' ? 'REQ123' : null
        }
      }
    };

    mockService.getRequestData.and.returnValue(of({
      my_request_submitted_data: {
        sessions: [
          { Requestnumber: 'REQ123', Submitteddate: '2025-09-24 12:00:00' }
        ]
      }
    }));

    mockService.getRequestChatData.and.returnValue(of({ chat: 'mockChat' }));

    await TestBed.configureTestingModule({
      declarations: [UserRRequestDetailComponent],
      providers: [
        { provide: SerrviceService, useValue: mockService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UserRRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set requestNumber from route param', () => {
      expect(component.requestNumber).toBe('REQ123');
    });

    it('should subscribe to chatDetailsForRequest$', () => {
      chatDetails$.next({ sessionDataId: '123', sessionDataUserName: 'userX' });
      expect(component.RequestDetailFromRequestPAge).toEqual({ sessionDataId: '123', sessionDataUserName: 'userX' });
    });

    it('should call hide after init', () => {
      expect(mockService.hide).toHaveBeenCalled();
    });
  });

  describe('fetchData', () => {
    it('should populate requestData and requestDetails correctly', () => {
      component.fetchData();
      expect(mockService.getRequestData).toHaveBeenCalled();
      expect(component.requestData.length).toBe(1);
      expect(component.requestData[0].Submitteddate).toBe('2025-09-24');
      expect(component.requestDetails?.Requestnumber).toBe('REQ123');
    });
  });

  describe('fetchRequestChat', () => {
    it('should not call API if RequestDetailFromRequestPAge is null', () => {
      component.RequestDetailFromRequestPAge = null;
      component.fetchRequestChat();
      expect(mockService.getRequestChatData).not.toHaveBeenCalled();
    });

    it('should call API if RequestDetailFromRequestPAge is defined', () => {
      component.RequestDetailFromRequestPAge = { sessionDataId: '123', sessionDataUserName: 'userX' };
      component.fetchRequestChat();
      expect(mockService.getRequestChatData).toHaveBeenCalled();
      expect(component.Responsed).toEqual({ chat: 'mockChat' });
    });
  });

  describe('processData', () => {
    it('should call setData with parsed object', () => {
      component.RequestDetailFromRequestPAge = { sessionDataId: '123', sessionDataUserName: 'userX' };
      const mockData = { message_session_data: JSON.stringify([{ msg: 'hello' }]) };

      component.processData(mockData);

      expect(mockService.setData).toHaveBeenCalledWith(jasmine.objectContaining({
        session_id: '123',
        user_name: 'userX',
        chatData: [{ msg: 'hello' }],
        comingFrom: 'request'
      }));
    });
  });

  describe('chatDetail', () => {
    it('should call show, processData and hide after timeout', fakeAsync(() => {
      spyOn(component, 'processData');
      component.Responsed = { message_session_data: JSON.stringify([]) };

      component.chatDetail();

      expect(mockService.show).toHaveBeenCalled();
      expect(component.processData).toHaveBeenCalledWith(component.Responsed);

      tick(2000);
      expect(mockService.hide).toHaveBeenCalledTimes(2); // one in ngOnInit, one after chatDetail
    }));
  });
});
