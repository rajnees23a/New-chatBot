import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SerrviceService } from './serrvice.service';
import { environment } from '../environments/environment';

describe('SerrviceService', () => {
  let service: SerrviceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SerrviceService]
    });
    service = TestBed.inject(SerrviceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post data with postData', () => {
    const dummyData = { foo: 'bar' };
    service.postData(dummyData).subscribe();
    const req = httpMock.expectOne(`${environment.portLocal}ada`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should update selected data', (done) => {
    const data = { test: 1 };
    service.selectedData$.subscribe(val => {
      if (val) {
        expect(val).toEqual(data);
        done();
      }
    });
    service.updateSelectedData(data);
  });

  it('should attach file', () => {
    const data = { foo: 'bar' };
    const file = new File([''], 'filename.txt');
    service.attachFile(data, file).subscribe();
    const req = httpMock.expectOne(`${environment.portLocal}adaaddionalfileupload`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should send data', () => {
    const data = { foo: 'bar' };
    const file = new File([''], 'filename.txt');
    service.sendData(data, file).subscribe();
    const req = httpMock.expectOne(`${environment.portLocal}ada`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should submit data', () => {
    const data = { foo: 'bar' };
    const file = new File([''], 'filename.txt');
    service.submitData(data, file).subscribe();
    const req = httpMock.expectOne(`${environment.portLocal}ui2dbupload`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should submit additional data', () => {
    const data = { foo: 'bar' };
    const file = new File([''], 'filename.txt');
    service.submitAdditionalData(data, file).subscribe();
    const req = httpMock.expectOne(`${environment.portDb}updatebicfields`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should additional submit data', () => {
    const data = { foo: 'bar' };
    const file = new File([''], 'filename.txt');
    service.additionalSubmitData(data, file).subscribe();
    const req = httpMock.expectOne(`${environment.portLocal}ui2dbupload`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should get request data', () => {
    const data = { foo: 'bar' };
    service.getRequestData(data).subscribe();
    const req = httpMock.expectOne(`${environment.portDb}my-requests`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should get request chat data', () => {
    const data = { foo: 'bar' };
    service.getRequestChatData(data).subscribe();
    const req = httpMock.expectOne(`${environment.portDb}db2uiretrival`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should set and get data', (done) => {
    const data = { foo: 'bar' };
    service.currentData$.subscribe(val => {
      if (val) {
        expect(val).toEqual(data);
        done();
      }
    });
    service.setData(data);
  });

  it('should set and get data for request chat show', (done) => {
    const data = { foo: 'bar' };
    service.chatDetailsForRequest$.subscribe(val => {
      if (val) {
        expect(val).toEqual(data);
        done();
      }
    });
    service.setDataForRequestChatShow(data);
  });

  it('should trigger and reset action', (done) => {
    let first = true;
    const sub = service.action$.subscribe(val => {
      if (first) {
        first = false; // skip the initial value
        return;
      }
      if (val.triggered) {
        expect(val.message).toBe('test');
        service.resetAction();
      } else if (!val.triggered && val.message === '') {
        sub.unsubscribe();
        done();
      }
    });
    service.triggerAction('test');
  });

  it('should show and hide loading', (done) => {
    let first = true;
    service.loading$.subscribe(val => {
      if (first) {
        first = false; // skip the initial false
        return;
      }
      if (val === true) {
        expect(val).toBe(true);
        service.hide();
      } else if (val === false) {
        expect(val).toBe(false);
        done();
      }
    });
    service.show();
  });

  it('should retriveData and update navbarDataSubject on valid response', () => {
    const data = { foo: 'bar' };
    service.retriveData(data);
    const req = httpMock.expectOne(`${environment.portLocal}retrieve-draft`);
    req.flush({ draft_data: { test: 1 } });
    service.navbarData$.subscribe(val => {
      expect(val).toEqual({ test: 1 });
    });
  });

  it('should retriveData and handle invalid response', () => {
    const data = { foo: 'bar' };
    spyOn(console, 'error');
    service.retriveData(data);
    const req = httpMock.expectOne(`${environment.portLocal}retrieve-draft`);
    req.flush({ invalid: true });
    expect(console.error).toHaveBeenCalled();
  });

  it('should retriveData and handle error', () => {
    const data = { foo: 'bar' };
    spyOn(console, 'error');
    service.retriveData(data);
    const req = httpMock.expectOne(`${environment.portLocal}retrieve-draft`);
    req.error(new ErrorEvent('Network error'));
    expect(console.error).toHaveBeenCalled();
  });

  it('should deletDraftData and call retriveData', () => {
    spyOn(service, 'retriveData');
    const data = { foo: 'bar' };
    service.deletDraftData(data);
    const req = httpMock.expectOne(`${environment.portDb}delete-draft`);
    req.flush({});
    expect(service.retriveData).toHaveBeenCalled();
  });
});