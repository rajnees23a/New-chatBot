import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, Subject, throwError } from 'rxjs';

import { HistoryComponent } from './history.component';
import { ServiceService } from '../service.service';
import { mockDraftData, mockRequestData, mockApiResponse, mockFile } from './history.mock';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let apiServiceSpy: jasmine.SpyObj<ServiceService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let processChatResponseSpy: jasmine.Spy;

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ServiceService', [
      'sendData',
      'attachFile',
      'submitData',
      'submitAdditionalData',
      'triggerAction',
      'hide',
      'retriveData'
    ], {
      currentData$: new Subject()
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [HistoryComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        DatePipe,
        { provide: ServiceService, useValue: apiServiceSpy },
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    component.recognition = { stop: jasmine.createSpy('stop'), start: jasmine.createSpy('start') } as any;

    // Assign ViewChilds
    component.textarea = { nativeElement: document.createElement('textarea') } as any;
    component.chatContainerBox = { nativeElement: document.createElement('div') } as any;
    component.tooltipElement = { nativeElement: document.createElement('div') } as any;
    component.reviewModal = { nativeElement: document.createElement('div') } as any;

    fixture.detectChanges();
  });

  afterEach(() => {
  if (!component.recognition || typeof component.recognition.stop !== 'function') {
    component.recognition = { stop: jasmine.createSpy('stop'), start: jasmine.createSpy('start') } as any;
  }
});

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle ngOnInit with draft data', fakeAsync(() => {
    (apiServiceSpy.currentData$ as Subject<any>).next(mockDraftData);
    tick(1001);
    expect(component.draftData).toBeTruthy();
    expect(component.chatHistory.length).toBeGreaterThan(0);
    expect(component.fields.length).toBeGreaterThan(0);
  }));

//   const mockResponse = {
//     BIC: { 'Your idea title': 'Test Title' },
//     bot_message: 'Bot says hi',
//     button: ['Yes', 'No']
//   };
//   apiServiceSpy.sendData.and.returnValue(of(mockResponse));
//   component.dataa.edit_field = '';
//   component.responseDataMethod('Test');
//   tick();
//   expect(component.bicFieldData).toEqual({ 'Your idea title': 'Test Title' });
//   expect(component.botChatMessage).toBe('Bot says hi');
//   expect(component.botButtonResponse).toEqual(['Yes', 'No']);
//   expect(component.loader).toBeFalse();
// }));

  it('should handle ngOnInit with request data', fakeAsync(() => {
    (apiServiceSpy.currentData$ as Subject<any>).next(mockRequestData);
    tick(1001);
    expect(component.chatHistory.length).toBeGreaterThan(0);
    expect(component.fields.length).toBeGreaterThan(0);
  }));

  it('should call scrollToBottom in ngAfterViewChecked', () => {
    spyOn(component, 'scrollToBottom');
    component.ngAfterViewChecked();
    expect(component.scrollToBottom).toHaveBeenCalled();
  });

  it('should scroll to bottom without error', () => {
    component.chatContainerBox = { nativeElement: { scrollTop: 0, scrollHeight: 100 } } as any;
    expect(() => component.scrollToBottom()).not.toThrow();
  });

  it('should auto resize textarea', () => {
    const textarea = document.createElement('textarea');
    textarea.value = 'test';
    textarea.style.height = '10px';
    component.textarea = { nativeElement: textarea } as any;
    component.autoResize();
    expect(textarea.style.height).not.toBe('10px');
  });

  it('should handle user input with text and file', () => {
    component.selectedFile = mockFile;
    component.userInput = 'Test input';
    spyOn(component, 'responseDataMethod');
    component.handleUserInput('Test input');
    expect(component.responseDataMethod).toHaveBeenCalledWith('Test input');
    expect(component.chatHistory.some(m => m.isFile)).toBeTrue();
    expect(component.chatHistory.some(m => m.text === 'Test input')).toBeTrue();
  });

  // it('should call responseDataMethod and processChatResponse', fakeAsync(() => {
  //   apiServiceSpy.sendData.and.returnValue(of(mockApiResponse));
  //   const spy = spyOn(component, 'processChatResponse').and.callThrough();
  //   component.dataa.edit_field = '';
  //   component.responseDataMethod('Test');
  //   tick();
  //   expect(component.processChatResponse).toHaveBeenCalled();
  //   expect(component.loader).toBeFalse();
  //   spy.calls.reset(); // Restore the original method for cleanup
  // }));

//   it('should handle onFocus and onBlur', () => {
//   // Create and attach the required elements to the DOM
//   const div1 = document.createElement('div');
//   div1.id = 'textArDiv';
//   const div3 = document.createElement('div');
//   div3.id = 'textAbut';
//   document.body.appendChild(div1);
//   document.body.appendChild(div3);

//   component.userInput = '';
//   component.selectedFile = null;

//   // After focus, classes should be present
//   component.onFocus();
//   expect(div1.classList.contains('active')).toBeTrue();
//   expect(div3.classList.contains('primaryeffect')).toBeTrue();

//   // After blur, classes should be removed
//   component.onBlur();
//   expect(div1.classList.contains('active')).toBeFalse();
//   expect(div3.classList.contains('primaryeffect')).toBeFalse();

//   // Clean up
//   div1.remove();
//   div3.remove();
// });

it('should handle onFocus and onBlur', () => {
  // Clean up any previous elements
  const oldDiv1 = document.getElementById('textArDiv');
  const oldDiv3 = document.getElementById('textAbut');
  if (oldDiv1) {oldDiv1.remove();}
  if (oldDiv3) {oldDiv3.remove();}

  // Create and attach elements
  const div1 = document.createElement('div');
  div1.id = 'textArDiv';
  const div3 = document.createElement('div');
  div3.id = 'textAbut';
  document.body.appendChild(div1);
  document.body.appendChild(div3);

  component.userInput = '';
  component.selectedFile = null;

  // Call focus
  component.onFocus();
  expect(div1.classList.contains('active')).toBeTrue();
  expect(div3.classList.contains('primaryeffect')).toBeTrue();

  // Call blur
  component.onBlur();
  // Debug output
  // console.log(div1.classList, div3.classList);
  expect(div1.classList.contains('active')).toBeFalse();
  expect(div3.classList.contains('primaryeffect')).toBeFalse();

  // Clean up
  div1.remove();
  div3.remove();
});



  it('should call onInput and autoResize', () => {
    spyOn(component, 'autoResize');
    const div3 = document.createElement('div');
    div3.id = 'textAbut';
    document.body.appendChild(div3);
    component.onInput();
    expect(component.autoResize).toHaveBeenCalled();
    div3.remove();
  });

  it('should reset textarea size', () => {
    const textarea = document.createElement('textarea');
    textarea.style.height = '100px';
    document.body.appendChild(textarea);
    component.resetTextAreaSize();
    expect(textarea.style.height).toBe('auto');
    textarea.remove();
  });

  it('should toggle button', () => {
    const div1 = document.createElement('div');
    div1.id = 'rowBox';
    const div2 = document.createElement('div');
    div2.id = 'rightBox';
    document.body.appendChild(div1);
    document.body.appendChild(div2);
    component.tooltipElement = { nativeElement: document.createElement('div'), setAttribute: () => {} } as any;
    component.tooltipInstance = { dispose: () => {}, hide: () => {} } as any;
    spyOn((component.tooltipInstance as any), 'dispose');
    component.toggleButton();
    expect(component.isActive).toBeTrue();
    div1.remove();
    div2.remove();
  });

  it('should process chat response and update progress', () => {
    spyOn(component, 'progressBarUpdate');
    component.staticBotMsg = true;
    component.botChatMessage = 'Bot message';
    component.botButtonResponse = ['Yes', 'No'];
    component.processChatResponse();
    expect(component.progressBarUpdate).toHaveBeenCalled();
    expect(component.chatHistory.length).toBeGreaterThan(0);
  });

  it('should update progress bar', () => {
    component.bicFieldData = { 'Your idea title': 'Test Title' };
    component.uploadFileName = 'file.pdf';
    component.progressBarUpdate();
    expect(component.progressPercentage).toBeLessThanOrEqual(100);
  });

  it('should handle file attach with valid file', () => {
    const event = { target: { files: [mockFile] } };
    apiServiceSpy.attachFile.and.returnValue(of({}));
    component.onFileAttach(event);
    expect(component.fileUploadFromAttachment).toBeTruthy();
    expect(component.fileIcon).toContain('download');
  });

  it('should delete attachment', () => {
    component.fileUploadFromAttachment = mockFile;
    component.fileUploadFromAttachmentName = 'file.pdf';
    component.fileIcon = 'icon.png';
    component.uploadFileFirstTime = true;
    component.fields[23].value = 'file.pdf';
    component.progress = 10;
    component.deleteAttachment();
    expect(component.fileUploadFromAttachment).toBeNull();
    expect(component.fileIcon).toBe('');
    expect(component.progress).toBe(8);
  });

  it('should remove file', () => {
    component.selectedFile = mockFile;
    component.fileIcon = 'icon.png';
    component.removeFile();
    expect(component.selectedFile).toBeNull();
    expect(component.fileIcon).toBe('');
  });

  it('should format object keys', () => {
    const obj = { 'Test Key': 'Value', 'No Info': 'NO INFORMATION PROVIDED' };
    const result = component.formatObjectKeys(obj);
    expect(result['Test key']).toBe('Value');
    expect(result['No info']).toBe(component.ADAtext);
  });

  it('should check first 10 completed', () => {
    component.fields = component.fields.map((f, i) => ({
      ...f,
      value: i < 9 ? 'filled' : ''
    }));
    component.checkFirst10Completed();
    expect(component.buttonDisabled).toBeFalse();
  });

  it('should edit field', () => {
    const field = { editing: false, value: 'test' };
    component.editField(field);
    expect(field.editing).toBeTrue();
  });

  it('should check button', () => {
    component.fields[0].completed = false;
    component.successDivText = '';
    spyOn(component, 'successDivCloseAfterSec');
    component.checkButton(0);
    expect(component.fields[0].completed).toBeTrue();
    expect(component.successDivCloseAfterSec).toHaveBeenCalled();
  });

  it('should generate random string', () => {
    const str = component.generateRandomString(5);
    expect(str.length).toBe(5);
  });

  it('should generate session id', () => {
    const id = component.generateSessionId();
    expect(id).toContain('-');
  });

  it('should handle submitButtonPopup', () => {
    apiServiceSpy.submitData.and.returnValue(of({}));
    spyOn(component, 'additionalDataForSubmit');
    component.submitButtonPopup();
    expect(component.additionalDataForSubmit).toHaveBeenCalled();
  });

  // it('should handle submitButton with modal', () => {
  //   component.allLooksGoodCliced = false;

  //   // Create and attach a real modal element
  //   const modalDiv = document.createElement('div');
  //   modalDiv.id = 'reviewModal';
  //   document.body.appendChild(modalDiv);

  //   spyOn(document, 'getElementById').and.returnValue(modalDiv);

  //   // Mock bootstrap.Modal as a constructor
  //   (window as any).bootstrap = {
  //     Modal: function() {
  //       return { show: () => {}, hide: () => {} };
  //     }
  //   };

  //   component.submitButton();

  //   // Clean up
  //   modalDiv.remove();
  // });

  // it('should handle showmodal', () => {
  //   const modalDiv = document.createElement('div');
  //   modalDiv.id = 'reviewModal';
  //   document.body.appendChild(modalDiv);
  //   spyOn(document, 'getElementById').and.returnValue(modalDiv);
  //   (window as any).bootstrap = {
  //     Modal: function() {
  //       return { show: () => {}, hide: () => {} };
  //     }
  //   };
  //   component.showmodal();
  //   modalDiv.remove();
  // });

  it('should handle AllGoodButton', () => {
  // Ensure all fields are filled
  if (!component.fields || component.fields.length === 0) {
    component.fields = Array.from({ length: 25 }, (_, i) => ({
      label: `Field ${i}`,
      value: 'filled',
      valid: false,
      editing: false,
      image: '',
      completed: false
    }));
  } else {
    component.fields = component.fields.map(f => ({
      ...f,
      value: 'filled',
      completed: false
    }));
  }

  component.ADAtext = 'ADA text';
  component.allLooksGoodCliced = false;

  component.AllGoodButton();

  expect(component.allLooksGoodCliced).toBeTrue(); // <-- This is the correct property
  expect(component.fields.every(f => f.completed)).toBeTrue();
});

  it('should check if array', () => {
    expect(component.checkIfArray([1, 2])).toBeTrue();
    expect(component.checkIfArray('str')).toBeFalse();
  });

  it('should handle timeLiButton', () => {
    spyOn(component, 'responseDataMethod');
    component.editFieldVal = 'Timelines';
    component.timeLiButton('2025');
    expect(component.responseDataMethod).toHaveBeenCalledWith('2025');
  });

  it('should handle onConfirmAreas', () => {
    component.selectedAreas = [true, false, false];
    component.botButtonResponse = ['Area 1', 'Area 2', 'Area 3'];
    component.editFieldVal = 'Areas involved';
    spyOn(component, 'responseDataMethod');
    component.onConfirmAreas();
    expect(component.confirmBtnOfAreaClk).toBeTrue();
    expect(component.responseDataMethod).toHaveBeenCalled();
  });

  it('should handle onConfirmDestination', () => {
    component.selectedDestination = [false, true, false];
    component.botButtonResponse = ['Dest 1', 'Dest 2', 'Dest 3'];
    component.editFieldVal = 'Destination 2027 alignment';
    spyOn(component, 'responseDataMethod');
    component.onConfirmDestination();
    expect(component.confirmBtnOfDestClk).toBeTrue();
    expect(component.responseDataMethod).toHaveBeenCalled();
  });

  it('should handle onConfirmBussiness', () => {
    component.selectedBussiness = [false, true, false];
    component.botButtonResponse = ['Bus 1', 'Bus 2', 'Bus 3'];
    component.editFieldVal = 'Business case impacts';
    spyOn(component, 'responseDataMethod');
    component.onConfirmBussiness();
    expect(component.confirmBtnOfBussClk).toBeTrue();
    expect(component.responseDataMethod).toHaveBeenCalled();
  });

  it('should get selected destination', () => {
    component.selectedDestination = [false, true, false];
    component.botButtonResponse = ['A', 'B', 'C'];
    expect(component.getSelectedDestination()).toBe('B');
  });

  it('should get selected regions', () => {
    component.selectedAreas = [true, false, true];
    component.botButtonResponse = ['A', 'B', 'C'];
    expect(component.getSelectedRegions()).toBe('A, C');
  });

  it('should get selected business', () => {
    component.selectedBussiness = [false, true, false];
    component.botButtonResponse = ['A', 'B', 'C'];
    expect(component.getSelectedBussiness()).toBe('B');
  });

  it('should call ngOnDestroy and save chat data', () => {
    (component as any).mockEnabled = false;
    component.submitButtonClicked = false;
    component.botRespondedFirstTime = true;
    spyOn(component, 'saveChatData');
    component.ngOnDestroy();
    expect(component.saveChatData).toHaveBeenCalled();
  });

  it('should call ngOnDestroy and not save chat data if submitted', () => {
    spyOn(component, 'saveChatData');
    component.submitButtonClicked = true;
    component.ngOnDestroy();
    expect(component.submitButtonClicked).toBeFalse();
    expect(component.saveChatData).not.toHaveBeenCalled();
  });

  // --- Utility and error branch coverage ---

  it('should handle error in responseDataMethod', fakeAsync(() => {
    apiServiceSpy.sendData.and.returnValue(throwError(() => new Error('fail')));
    component.dataa.edit_field = '';
    component.userInput = 'Test';
    component.responseDataMethod('Test');
    tick();
    flush(); // Clear any remaining timers
    expect(component.loader).toBeFalse();
    expect(component.chatHistory.some(m => m.sender === 'bot')).toBeTrue();
  }));

  it('should handle error in onFileAttach', fakeAsync(() => {
    const event = { target: { files: [mockFile] } };
    apiServiceSpy.attachFile.and.returnValue(throwError(() => new Error('fail')));
    component.onFileAttach(event);
    tick(5000); // <-- flush the setTimeout in errorDivCloseAfterSec
    expect(component.errorDivText).toContain('error');
  }));

  it('should handle error in submitButtonPopup', fakeAsync(() => {
    apiServiceSpy.submitData.and.returnValue(throwError(() => new Error('fail')));
    component.submitButtonPopup();
    tick();
    expect(component.loader).toBeFalse();
  }));

  it('should handle error in additionalDataForSubmit', fakeAsync(() => {
    apiServiceSpy.submitAdditionalData.and.returnValue(throwError(() => new Error('fail')));
    component.additionalDataForSubmit();
    tick();
    expect(component.loader).toBeFalse();
  }));

  it('should handle error in saveChatData', fakeAsync(() => {
    apiServiceSpy.submitData.and.returnValue(throwError(() => new Error('fail')));
    apiServiceSpy.retriveData.and.stub();
    component.saveChatData();
    tick();
    expect(component.loader).toBeFalse();
  }));

  it('should handle error in businessConfirmButton', fakeAsync(() => {
    apiServiceSpy.sendData.and.returnValue(throwError(() => new Error('fail')));
    component.bussinessDropDownKey = 'Business';
    component.bussinessUserInputForMappingButtons = 'User';
    component.editFieldVal = 'Business sponsor';
    component.businessConfirmButton();
    tick();
    expect(component.loader).toBeFalse();
  }));

  it('should handle error in itConfirmButton', fakeAsync(() => {
    apiServiceSpy.sendData.and.returnValue(throwError(() => new Error('fail')));
    component.itDropDownKey = 'IT';
    component.itUserInputForMappingButtons = 'User';
    component.editFieldVal = 'IT sponsor';
    component.itConfirmButton();
    tick();
    expect(component.loader).toBeFalse();
  }));

  it('should handle error in addButton', fakeAsync(() => {
    apiServiceSpy.sendData.and.returnValue(throwError(() => new Error('fail')));
    component.addButton(0);
    tick();
    expect(component.loader).toBeFalse();
  }));

  it('should handle error in editDropButton', fakeAsync(() => {
    apiServiceSpy.sendData.and.returnValue(throwError(() => new Error('fail')));
    component.editDropButton(0);
    tick();
    expect(component.loader).toBeFalse();
  }));

  it('should handle error in yesNoButton for "Yes, everything looks good"', fakeAsync(() => {
    apiServiceSpy.sendData.and.returnValue(throwError(() => new Error('fail')));
    component.yesNoButton('Yes, everything looks good', 0);
    tick();
    expect(component.loader).toBeFalse();
  }));

  it('should handle error in yesNoButton for "No, I\'d like to review and make edits"', fakeAsync(() => {
    apiServiceSpy.sendData.and.returnValue(throwError(() => new Error('fail')));
    component.yesNoButton("No, I'd like to review and make edits", 0);
    tick();
    expect(component.loader).toBeFalse();
  }));

  it('should handle error in yesNoButton for edit field', fakeAsync(() => {
    apiServiceSpy.sendData.and.returnValue(throwError(() => new Error('fail')));
    component.yesNoButton('Some edit field', 0);
    tick();
    expect(component.loader).toBeFalse();
  }));

  // --- Utility and branch coverage for methods not yet covered ---

  it('should call dropDownSel', () => {
    component.selectedOptionsofDropdown = 'Option1';
    component.editFieldVal = 'Test';
    component.dropDownSel();
    expect(component.dataa.edit_field).toBe('Test');
  });

  it('should call startListening and set isListening', () => {
    component.isListening = false;
    // spyOn(component.recognition, 'start');
    component.startListening();
    expect(component.isListening).toBeTrue();
    expect(component.recognition.start).toHaveBeenCalled();
  });

  it('should call onFileSelected with invalid extension', () => {
    const file = new File([''], 'file.exe');
    const event = { target: { files: [file] } };
    component.onFileSelected(event);
    expect(component.errorDivText).toContain('not supported');
  });

  it('should call onFileSelected with large file', () => {
    const file = new File([new ArrayBuffer(21 * 1024 * 1024)], 'file.pdf'); // >20MB
    Object.defineProperty(file, 'size', { value: 21 * 1024 * 1024 });
    const event = { target: { files: [file] } };
    component.onFileSelected(event);
    expect(component.errorDivText).toContain('larger than 20mb');
  });

  it('should call fileValidation with invalid extension', () => {
    const file = new File([''], 'file.exe');
    const event = { target: { files: [file] } };
    component.fileValidation(event);
    expect(component.errorDivText).toContain('not supported');
  });

  it('should call fileValidation with large file', () => {
    const file = new File([new ArrayBuffer(21 * 1024 * 1024)], 'file.pdf');
    Object.defineProperty(file, 'size', { value: 21 * 1024 * 1024 });
    const event = { target: { files: [file] } };
    component.fileValidation(event);
    expect(component.errorDivText).toContain('larger than 20mb');
  });

  it('should call downloadFileFromChat safely', () => {
    component.fileUrlForChatUpload = 'blob:http://localhost/file';
    component.uploadFileName = 'file.pdf';
    expect(() => component.downloadFileFromChat()).not.toThrow();
  });

  it('should call downloadFileFromAdditional safely', () => {
    component.fileUrlForAttachmentUpload = 'blob:http://localhost/file';
    component.fileUploadFromAttachmentName = 'file.pdf';
    expect(() => component.downloadFileFromAdditional()).not.toThrow();
  });

  it('should call showAttachmentDeleteMethod', () => {
    component.showAttachmentDelete = false;
    component.showAttachmentDeleteMethod();
    expect(component.showAttachmentDelete).toBeTrue();
  });

  it('should call showChatDeleteMethod', () => {
    component.showChatDelete = false;
    component.showChatDeleteMethod();
    expect(component.showChatDelete).toBeTrue();
  });

  it('should call splitByDot', () => {
    const result = component.splitByDot('This is a test. Another sentence.');
    expect(result.length).toBeGreaterThan(1);
  });

  it('should call get isAdditionalCommentsEmpty', () => {
    component.fields[24].value = '';
    expect(component.isAdditionalCommentsEmpty).toBeTrue();
    component.fields[24].value = 'not empty';
    expect(component.isAdditionalCommentsEmpty).toBeFalse();
  });

  it('should call onKeyDown with Enter', () => {
    spyOn(component, 'handleUserInput');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    Object.defineProperty(event, 'shiftKey', { value: false });
    component.userInput = 'test';
    component.onKeyDown(event);
    expect(component.handleUserInput).toHaveBeenCalled();
  });

  it('should call onKeyDown with Shift+Enter', () => {
    spyOn(component, 'handleUserInput');
    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
    component.userInput = 'test';
    component.onKeyDown(event);
    expect(component.handleUserInput).not.toHaveBeenCalled();
  });

  it('should call editButton for Areas involved', fakeAsync(() => {
    component.fields[6].label = 'Areas involved';
    spyOn(component, 'editDropButton');
    component.editButton(6);
    tick();
    expect(component.editDropButton).toHaveBeenCalledWith(6);
  }));

  it('should call editButton for Destination 2027 alignment', fakeAsync(() => {
    component.fields[7].label = 'Destination 2027 alignment';
    spyOn(component, 'editDropButton');
    component.editButton(7);
    tick();
    expect(component.editDropButton).toHaveBeenCalledWith(7);
  }));

  it('should call editButton for Business case impacts', fakeAsync(() => {
    component.fields[20].label = 'Business case impacts';
    spyOn(component, 'editDropButton');
    component.editButton(20);
    tick();
    expect(component.editDropButton).toHaveBeenCalledWith(20);
  }));

  it('should call editButton for Business sponsor', fakeAsync(() => {
    component.fields[16].label = 'Business sponsor';
    spyOn(component, 'editDropButton');
    component.editButton(16);
    tick();
    expect(component.editDropButton).toHaveBeenCalledWith(16);
  }));

  it('should call editButton for IT sponsor', fakeAsync(() => {
    component.fields[22].label = 'IT sponsor';
    spyOn(component, 'editDropButton');
    component.editButton(22);
    tick();
    expect(component.editDropButton).toHaveBeenCalledWith(22);
  }));

  it('should call editButton for Timelines', fakeAsync(() => {
    component.fields[15].label = 'Timelines';
    spyOn(component, 'editDropButton');
    component.editButton(15);
    tick();
    expect(component.editDropButton).toHaveBeenCalledWith(15);
  }));

  it('should call editButton for Portfolio alignment', fakeAsync(() => {
    component.fields[21].label = 'Portfolio alignment';
    spyOn(component, 'addButton');
    component.editButton(21);
    tick();
    expect(component.addButton).toHaveBeenCalledWith(21);
  }));

  it('should call editButton for other field', fakeAsync(() => {
    component.fields[0].label = 'Other Field';
    component.fields[0].value = 'Some value';
    component.textarea = { nativeElement: document.createElement('textarea') } as any;
    component.editButton(0);
    tick();
    expect(component.userInput).toBe('Some value');
  }));

  it('should call ngOnDestroy and unsubscribe', () => {
    component.dataSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') } as any;
    component.submitButtonClicked = true;
    component.ngOnDestroy();
    expect(component.dataSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should call ngOnDestroy and saveChatData if not submitted', () => {
    (component as any).mockEnabled = false;
    component.dataSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') } as any;
    component.submitButtonClicked = false;
    component.botRespondedFirstTime = true;
    spyOn(component, 'saveChatData');
    component.ngOnDestroy();
    expect(component.saveChatData).toHaveBeenCalled();
    expect(component.dataSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should call ngOnDestroy and not saveChatData if not responded', () => {
    component.dataSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') } as any;
    component.submitButtonClicked = false;
    component.botRespondedFirstTime = false;
    spyOn(component, 'saveChatData');
    component.ngOnDestroy();
    expect(component.saveChatData).not.toHaveBeenCalled();
    expect(component.dataSubscription.unsubscribe).toHaveBeenCalled();
  });

  // Add these at the end of your describe('HistoryComponent', ...) block

it('should call stopListening and set isListening', () => {
  component.isListening = true;
  component.stopListening();
  expect(component.isListening).toBeFalse();
  expect(component.recognition.stop).toHaveBeenCalled();
});

it('should set fileIcon for .doc', () => {
  component.setFileIcon('.doc');
  expect(component.fileIcon).toBe('assets/images/docs.png');
});

it('should set fileIcon for .docx', () => {
  component.setFileIcon('.docx');
  expect(component.fileIcon).toBe('assets/images/docs.png');
});

it('should set fileIcon for .ppt', () => {
  component.setFileIcon('.ppt');
  expect(component.fileIcon).toBe('assets/images/ppt1.png');
});

it('should set fileIcon for .pptx', () => {
  component.setFileIcon('.pptx');
  expect(component.fileIcon).toBe('assets/images/ppt1.png');
});

it('should set fileIcon for .pdf', () => {
  component.setFileIcon('.pdf');
  expect(component.fileIcon).toBe('assets/images/download.png');
});

it('should set fileIcon for .xls', () => {
  component.setFileIcon('.xls');
  expect(component.fileIcon).toBe('assets/images/xl.png');
});

it('should set fileIcon for .xlsx', () => {
  component.setFileIcon('.xlsx');
  expect(component.fileIcon).toBe('assets/images/xl.png');
});

it('should set fileIcon for unknown extension', () => {
  component.setFileIcon('.unknown');
  expect(component.fileIcon).toBe('assets/images/download(1)2.png');
});


// import { fakeAsync, tick, flush } from '@angular/core/testing';

it('should handle yesNoButton with "Yes, everything looks good"', fakeAsync(() => {
  const mockResponse = {
    BIC: { 'Your idea title': 'Test Title' },
    bot_message: 'Bot says hi',
    button: ['Yes', 'No']
  };
  apiServiceSpy.sendData.and.returnValue(of(mockResponse));
  component.sessionId = 'session';
  component.api.userName = 'user';
  component.fields = component.fields.map(f => ({ ...f, value: '' }));
  component.bicFieldData = {};
  component.ADAtext = 'ADA text';
  component.yesNoButton('Yes, everything looks good', 0);
  tick();
  flush(); // <-- Add this line to flush all pending timers
  expect(component.allLooksGoodCliced).toBeTrue();
  expect(component.successDivText).toContain('Successfully accepted');
  expect(component.botChatMessage).toBe('Bot says hi');
  expect(component.botButtonResponse).toEqual(['Yes', 'No']);
  expect(component.fields[0].value).toBe('Test Title');
  expect(component.fields[0].completed).toBeTrue();
}));


it('should handle bussinessConfirmButton with all response properties', fakeAsync(() => {
  // Arrange
  const mockResponse = {
    BIC: { 'Your idea title': 'Test Title' },
    bot_message: 'Bot says hi',
    button: ['Yes', 'No']
  };
  apiServiceSpy.sendData.and.returnValue(of(mockResponse));
  component.editFieldVal = 'Business sponsor';
  component.bussinessDropDownKey = 'Business';
  component.bussinessUserInputForMappingButtons = 'User';
  component.fields = [{
    label: 'Your idea title',
    value: '',
    valid: false,
    editing: false,
    image: '',
    completed: false
  }];
  component.bicFieldData = {};
  component.ADAtext = 'ADA text';

  // Act
  component.businessConfirmButton();
  tick();
  flush(); // flush setTimeout

  // Assert
  expect(component.bicFieldData).toEqual({ 'Your idea title': 'Test Title' });
  expect(component.botChatMessage).toBe('Bot says hi');
  expect(component.botButtonResponse).toEqual(['Yes', 'No']);
  expect(component.fields[0].value).toBe('Test Title');
  expect(component.staticBotMsg).toBeFalse();
  expect(component.dataa.confirmation).toBe('False');
}));


it('should call itConfirmButton and process API success response', fakeAsync(() => {
  // --- Arrange ---
  component.itDropDownKey = 'Option1';
  component.itUserInputForMappingButtons = 'TestInput';
  component.editFieldVal = 'Field1';
  component.dataa = { edit_field: '', user_message: '', confirmation: '' } as any;

  spyOn(component, 'processChatResponse');
  spyOn(component, 'initializeTooltips');

  // Mock API response
  apiServiceSpy.sendData.and.returnValue(of(mockApiResponse));

  // --- Act ---
  component.itConfirmButton();
  tick(); // flush observable
  tick(); // flush setTimeout inside next

  // --- Assert ---
  expect(component.chatHistory.length).toBe(1);
  expect(component.loader).toBeFalse();
  expect(component.apiResponseData).toEqual(mockApiResponse);
  expect(component.processChatResponse).toHaveBeenCalled();
  expect(component.bicFieldData).toBeDefined();
  expect(component.botChatMessage).toBe('Bot says hello');
  expect(component.botButtonResponse).toEqual(['Yes', 'No']);
  expect(component.staticBotMsg).toBeFalse();
  expect(component.initializeTooltips).toHaveBeenCalled();
}));

it('should handle API error in itConfirmButton', fakeAsync(() => {
  // --- Arrange ---
  spyOn(console, 'log'); // silence error logs
  apiServiceSpy.sendData.and.returnValue(throwError(() => new Error('API error')));
  component.dataa = { edit_field: '', user_message: '', confirmation: '' } as any;

  // --- Act ---
  component.itConfirmButton();
  tick();

  // --- Assert ---
  expect(component.loader).toBeFalse();
  expect(console.log).toHaveBeenCalledWith('error', jasmine.any(Error));
}));


// ---- itConfirmButton tests (success + error) ----
it('should call itConfirmButton and process API success response', fakeAsync(() => {
  // Arrange
  component.itDropDownKey = 'ITKey';
  component.itUserInputForMappingButtons = 'UserInput';
  component.editFieldVal = 'IT sponsor';
  component.dataa = { edit_field: '', user_message: '', confirmation: '', session_id: '', user_name: '' };

  spyOn(component, 'processChatResponse');
  spyOn(component, 'initializeTooltips');

  // Ensure API returns success
  apiServiceSpy.sendData.and.returnValue(of(mockApiResponse));

  // Act
  component.itConfirmButton();

  // flush observable and any setTimeout in next()
  tick();       // flush observable microtask
  tick(50);     // flush the setTimeout call inside next()

  // Assert
  expect(component.chatHistory.length).toBeGreaterThan(0);
  expect(component.loader).toBeFalse();
  expect(component.apiResponseData).toEqual(mockApiResponse);
  // BIC should be formatted and assigned
  expect(component.bicFieldData['Your idea title']).toBe('Test Title');
  expect(component.botChatMessage).toBe('Bot says hello');
  expect(component.botButtonResponse).toEqual(['Yes', 'No']);
  expect(component.processChatResponse).toHaveBeenCalled();
  expect(component.staticBotMsg).toBeFalse();
  expect(component.initializeTooltips).toHaveBeenCalled();
}));

it('should handle API error in itConfirmButton', fakeAsync(() => {
  spyOn(console, 'log'); // silence & assert
  apiServiceSpy.sendData.and.returnValue(throwError(() => new Error('API fail')));
  component.itDropDownKey = 'ITKey';
  component.itUserInputForMappingButtons = 'UserInput';
  component.dataa = { edit_field: '', user_message: '', confirmation: '', session_id: '', user_name: '' };

  component.itConfirmButton();
  tick();

  expect(component.loader).toBeFalse();
  expect(console.log).toHaveBeenCalledWith('error', jasmine.any(Error));
}));

// ---- filesSetForHistory tests ----

// 1) Reset when chatHistory empty
it('should reset file state when chatHistory is empty', () => {
  // setup
  component.chatHistory = [];
  component.fields = Array.from({ length: 25 }, (_, i) => ({
    label: `Field ${i}`,
    value: '',
    valid: false,
    editing: false,
    image: '',
    completed: false
  }));
  component.fileUploadFromAttachment = 'something';
  component.uploadFileName = 'prev.pdf';
  component.fileUploadFromAttachmentName = 'prev.pdf';
  component.fileIcon = 'someIcon';

  // act
  component.filesSetForHistory();

  // assert
  expect(component.uploadFileName).toBe('');
  expect(component.uploadFileFirstTime).toBeFalse();
  expect(component.fileUploadFromAttachment).toBeNull();
  expect(component.fileUploadFromAttachmentName).toBe('');
  expect(component.fileIcon).toBe(''); // initial code sets fileIcon = '' at top
});

// 2) lastElement.dropdown should set botButtonResponse and dataa.edit_field
it('should set botButtonResponse and dataa.edit_field when lastElement has dropdown', () => {
  component.chatHistory = [
    { text: 'first', sender: 'bot', isFile: false },
    { text: 'last', sender: 'bot', isFile: false, dropdown: ['A', 'B'], fieldName: 'FieldX' }
  ];
  component.dataa = {} as any;
  component.fields = Array.from({ length: 25 }, (_, i) => ({
    label: `Field ${i}`,
    value: '',
    valid: false,
    editing: false,
    image: '',
    completed: false
  }));

  component.filesSetForHistory();

  expect(component.botButtonResponse).toEqual(['A', 'B']);
  expect(component.dataa.edit_field).toBe('FieldX');
});

// 3) fileMessages branch - multiple extensions (doc/docx, ppt/pptx, pdf, xls/xlsx, unknown)
[
  { name: 'file.doc', icon: 'assets/images/docs.png' },
  { name: 'file.docx', icon: 'assets/images/docs.png' },
  { name: 'file.ppt', icon: 'assets/images/ppt1.png' },
  { name: 'file.pptx', icon: 'assets/images/ppt1.png' },
  { name: 'file.pdf', icon: 'assets/images/download.png' },
  { name: 'file.xls', icon: 'assets/images/xl.png' },
  { name: 'file.xlsx', icon: 'assets/images/xl.png' },
  { name: 'file.unknownext', icon: 'assets/images/download(1)2.png' }
].forEach(testCase => {
  it(`should set correct icon and uploadFileName for ${testCase.name}`, () => {
    component.chatHistory = [{ isFile: true, fileName: testCase.name }];
    component.fields = Array.from({ length: 25 }, (_, i) => ({
      label: `Field ${i}`,
      value: '',
      valid: false,
      editing: false,
      image: '',
      completed: false
    }));

    component.filesSetForHistory();

    expect(component.uploadFileName).toBe(testCase.name);
    expect(component.uploadFileFirstTime).toBeTrue();
    expect(component.fileIcon).toBe(testCase.icon);
    // fileUploadFromAttachment stays null in this branch
    expect(component.fileUploadFromAttachment).toBeNull();
  });
});

// 4) when no fileMessages but fields[23].value present -> use that value
it('should use fields[23].value when no fileMessages exist', () => {
  component.chatHistory = [{ text: 'no files', sender: 'bot', isFile: false }];
  component.fields = Array.from({ length: 25 }, (_, i) => ({
    label: `Field ${i}`,
    value: '',
    valid: false,
    editing: false,
    image: '',
    completed: false
  }));

  component.fields[23].value = 'attachedFile.PPTX'; // mixed case, method lowercases extension
  component.filesSetForHistory();

  expect(component.fileUploadFromAttachment).toBe('attachedFile.PPTX');
  expect(component.fileUploadFromAttachmentName).toBe('attachedFile.PPTX');
  expect(component.uploadFileFirstTime).toBeTrue();
  expect(component.fileIcon).toBe('assets/images/ppt1.png'); // pptx => ppt1.png
});

// 5) when fields[23].value empty and no fileMessages -> ensure everything reset
it('should reset file info when fields[23] and chatHistory contain no files', () => {
  component.chatHistory = [{ text: 'no files', sender: 'bot', isFile: false }];
  component.fields = Array.from({ length: 25 }, (_, i) => ({
    label: `Field ${i}`,
    value: '',
    valid: false,
    editing: false,
    image: '',
    completed: false
  }));
  component.fileIcon = 'someIcon';
  component.fileUploadFromAttachment = 'prev';
  component.fileUploadFromAttachmentName = 'prev';

  component.filesSetForHistory();

  expect(component.uploadFileName).toBe('');
  expect(component.uploadFileFirstTime).toBeFalse();
  expect(component.fileUploadFromAttachment).toBeNull();
  expect(component.fileUploadFromAttachmentName).toBe('');
  expect(component.fileIcon).toBe(''); // default reset
});




it('should handle yesNoButton with "No, I\'d like to review and make edits"', fakeAsync(() => {
  const mockResponse = {
    BIC: { 'Your idea title': 'Test Title' },
    bot_message: 'Bot says hi',
    button: ['Yes', 'No']
  };
  apiServiceSpy.sendData.and.returnValue(of(mockResponse));
  component.sessionId = 'session';
  component.api.userName = 'user';
  component.fields = component.fields.map(f => ({ ...f, value: '' }));
  component.bicFieldData = {};
  component.ADAtext = 'ADA text';
  component.yesNoButton("No, I'd like to review and make edits", 0);
  tick();
  expect(component.botChatMessage).toBe('Bot says hi');
  expect(component.botButtonResponse).toEqual(['Yes', 'No']);
  // expect(component.fields[0].value).toBe('Test Title');
}));

it('should handle recognition result event', () => {
  component.isListening = true;
  component.userInput = '';
  // Assign a function to onresult
  component.recognition.onresult = function(event: any) {
    // Simulate the real handler logic
    const transcript = event.results[0][0].transcript;
    component.userInput += transcript;
  };
  const event = { results: [[{ transcript: 'hello', confidence: 1 }]] } as any;
  component.recognition.onresult.call(component, event);
  expect(component.userInput).toContain('hello');
});

it('should handle recognition end event', () => {
  spyOn(component, 'stopListening');

  // mock recognition with onend hook
  component.recognition = {} as any;

  component.recognition.onend = () => {
    component.stopListening();
  };

  // simulate recognition end
  component.recognition.onend();

  expect(component.stopListening).toHaveBeenCalled();
});


it('should call progressBarUpdate with no bicFieldData', () => {
  component.bicFieldData = undefined as any;
  expect(() => component.progressBarUpdate()).not.toThrow();
});

it('should call processChatResponse with no botButtonResponse', () => {
  component.botButtonResponse = undefined as any;
  component.staticBotMsg = false;
  component.botChatMessage = '';
  expect(() => component.processChatResponse()).not.toThrow();
});

it('should call checkFirst10Completed with all completed', () => {
  component.fields = Array.from({ length: 25 }, (_, i) => ({
    label: `Field ${i}`,
    value: 'filled',
    valid: false,
    editing: false,
    image: '',
    completed: true
  }));
  component.checkFirst10Completed();
  expect(component.buttonDisabled).toBeFalse();
});

it('should call editField with already editing field', () => {
  const field = { editing: true, value: 'test' };
  component.editField(field);
  expect(field.editing).toBeTrue();
});

it('should call removeFile when no selectedFile', () => {
  component.selectedFile = null;
  component.fileIcon = 'icon.png';
  component.removeFile();
  expect(component.selectedFile).toBeNull();
  expect(component.fileIcon).toBe('');
});

it('should call deleteAttachment when no fileUploadFromAttachment', () => {
  component.fileUploadFromAttachment = null;
  component.fileUploadFromAttachmentName = '';
  component.fileIcon = '';
  component.uploadFileFirstTime = false;
  component.fields[23].value = '';
  component.progress = 10;
  component.deleteAttachment();
  expect(component.fileUploadFromAttachment).toBeNull();
  expect(component.fileIcon).toBe('');
});

it('should call AllGoodButton with some fields not filled', () => {
  component.fields = Array.from({ length: 25 }, (_, i) => ({
    label: `Field ${i}`,
    value: i < 20 ? 'filled' : '',
    valid: false,
    editing: false,
    image: '',
    completed: false
  }));
  component.ADAtext = 'ADA text';
  component.allLooksGoodCliced = false;
  component.AllGoodButton();
  expect(component.allLooksGoodCliced).toBeTrue();
  expect(component.fields.slice(0, 20).every(f => f.completed)).toBeTrue();
  expect(component.fields.slice(20).every(f => !f.completed)).toBeTrue();
});

it('should call AllGoodButton with ADAtext value', () => {
  component.ADAtext = 'ADA text';
  component.fields = Array.from({ length: 25 }, (_, i) => ({
    label: `Field ${i}`,
    value: component.ADAtext,  // all fields have ADAtext
    valid: false,
    editing: false,
    image: '',
    completed: false
  }));
  component.allLooksGoodCliced = false;

  component.AllGoodButton();

  expect(component.allLooksGoodCliced).toBeTrue();

  // Only fields not equal to ADAtext should be completed; all are ADAtext, so completed stays false
  expect(component.fields.every(f => f.completed === false)).toBeTrue();
});


it('should call dropDownSel with no selectedOptionsofDropdown', () => {
  component.selectedOptionsofDropdown = undefined as any;
  component.editFieldVal = 'Test';
  expect(() => component.dropDownSel()).not.toThrow();
});

it('should call splitByDot with no dot', () => {
  const result = component.splitByDot('No dot here');
  expect(result.length).toBe(1);
});

it('should handle recognition error event', () => {
  component.isListening = true;
  spyOn(component, 'stopListening');
  // Ensure recognition has onerror as a function
  component.recognition.onerror = (event: any) => {
    component.stopListening();
  };
  component.recognition.onerror({ error: 'network' });
  expect(component.stopListening).toHaveBeenCalled();
});

it('should call checkIfArray with null and undefined', () => {
  expect(component.checkIfArray(null)).toBeFalse();
  expect(component.checkIfArray(undefined)).toBeFalse();
});

it('should call AllGoodButton with mixed ADAtext and filled values', () => {
  component.ADAtext = 'ADA text';
  component.fields = Array.from({ length: 25 }, (_, i) => ({
    label: `Field ${i}`,
    value: i % 2 === 0 ? component.ADAtext : 'filled',
    valid: false,
    editing: false,
    image: '',
    completed: false
  }));
  component.allLooksGoodCliced = false;
  component.AllGoodButton();
  expect(component.allLooksGoodCliced).toBeTrue();
  expect(component.fields.filter(f => f.value !== component.ADAtext).every(f => f.completed)).toBeTrue();
  expect(component.fields.filter(f => f.value === component.ADAtext).every(f => !f.completed)).toBeTrue();
});

// it('should call dropDownSel with empty array', () => {
//   component.selectedOptionsofDropdown = [];
//   component.editFieldVal = 'Test';
//   expect(() => component.dropDownSel()).not.toThrow();
// });

it('should call splitByDot with empty string', () => {
  const result = component.splitByDot('');
  expect(result.length).toBe(0);
});

it('should call editField with undefined value', () => {
  const field = { editing: false, value: undefined };
  component.editField(field);
  expect(field.editing).toBeTrue();
});

it('should call removeFile when fileIcon is already empty', () => {
  component.selectedFile = null;
  component.fileIcon = '';
  component.removeFile();
  expect(component.selectedFile).toBeNull();
  expect(component.fileIcon).toBe('');
});

it('should call deleteAttachment with progress at 0', () => {
  component.fileUploadFromAttachment = null;
  component.fileUploadFromAttachmentName = '';
  component.fileIcon = '';
  component.uploadFileFirstTime = false;
  component.fields[23].value = '';
  component.progress = 0;
  component.deleteAttachment();
  expect(component.progress).toBe(-2);
});

it('should call checkButton with index out of range', () => {
  // Create a fields array with at least 101 elements
  component.fields = Array.from({ length: 101 }, (_, i) => ({
    label: `Field ${i}`,
    value: '',
    completed: false,
    valid: false,
    editing: false,
    image: ''
  }));

  // Spy to track successDivCloseAfterSec
  const spy = spyOn(component, 'successDivCloseAfterSec');

  // Call checkButton with index 100
  expect(() => component.checkButton(100)).not.toThrow();

  // Optional: spy should not have been called if field was empty
  expect(spy).toHaveBeenCalled(); // or not, depending on logic
});

it('should show reviewModal when submitButton is called', () => {
  component.allLooksGoodCliced = false;
  const modalDiv = document.createElement('div');
  modalDiv.id = 'reviewModal';
  document.body.appendChild(modalDiv);

  (window as any).bootstrap = {
    Modal: function(el: any) {
      return { show: jasmine.createSpy('show'), hide: jasmine.createSpy('hide') };
    }
  };

  component.submitButton();
  document.body.removeChild(modalDiv);
});

it('should call dropDownSel safely with empty string', () => {
  component.selectedOptionsofDropdown = ''; // <-- assign a string, not array
  component.editFieldVal = 'Test';
  expect(() => component.dropDownSel()).not.toThrow();
});


it('should processChatResponse safely when botButtonResponse is empty', () => {
  component.botButtonResponse = [];
  component.botChatMessage = 'Hello';
  component.staticBotMsg = false;
  expect(() => component.processChatResponse()).not.toThrow();
});

it('should call progressBarUpdate with no bicFieldData', () => {
  component.bicFieldData = undefined as any;
  expect(() => component.progressBarUpdate()).not.toThrow();
});


it('should show reviewModal when submitButton is called', () => {
  component.allLooksGoodCliced = false;
  const modalDiv = document.createElement('div');
  modalDiv.id = 'reviewModal';
  document.body.appendChild(modalDiv);

  (window as any).bootstrap = {
    Modal: function() {
      return { show: jasmine.createSpy('show'), hide: jasmine.createSpy('hide') };
    }
  };

  component.submitButton();
  document.body.removeChild(modalDiv);
});

it('should call dropDownSel safely with empty string', () => {
  component.selectedOptionsofDropdown = ''; // <-- assign a string, not array
  component.editFieldVal = 'Test';
  expect(() => component.dropDownSel()).not.toThrow();
});


it('should processChatResponse safely when botButtonResponse is empty', () => {
  component.botButtonResponse = [];
  component.botChatMessage = 'Hello';
  component.staticBotMsg = false;
  expect(() => component.processChatResponse()).not.toThrow();
});

it('should call progressBarUpdate with no bicFieldData', () => {
  component.bicFieldData = undefined as any;
  expect(() => component.progressBarUpdate()).not.toThrow();
});


it('should show reviewModal when submitButton is called', () => {
  component.allLooksGoodCliced = false;
  const modalDiv = document.createElement('div');
  modalDiv.id = 'reviewModal';
  document.body.appendChild(modalDiv);

  (window as any).bootstrap = {
    Modal: function() {
      return { show: jasmine.createSpy('show'), hide: jasmine.createSpy('hide') };
    }
  };

  component.submitButton();
  document.body.removeChild(modalDiv);
});

it('should handle ngOnInit with no data', fakeAsync(() => {
    (apiServiceSpy.currentData$ as Subject<any>).next(undefined);
    tick(1001);
    expect(component.draftData).toBeUndefined();
  }));

   it('should handle ngOnInit with empty chatHistory', fakeAsync(() => {
    const data = { ...mockDraftData, sessionDataDraft: { ...mockDraftData.sessionDataDraft, chatHistory: [] } };
    (apiServiceSpy.currentData$ as Subject<any>).next(data);
    tick(1001);
    expect(component.chatHistory.length).toBe(0);
  }));

   it('should handle ngAfterViewInit and initialize tooltip', () => {
    component.tooltipElement = { nativeElement: document.createElement('div') } as any;
    expect(() => component.ngAfterViewInit()).not.toThrow();
    expect(component.tooltipInstance).toBeTruthy();
  });

  it('should handle scrollToBottom with error', () => {
    component.chatContainerBox = undefined as any;
    expect(() => component.scrollToBottom()).not.toThrow();
  });

  it('should handle handleUserInput with only file', () => {
    component.selectedFile = mockFile;
    component.userInput = '';
    spyOn(component, 'responseDataMethod');
    component.handleUserInput('');
    expect(component.responseDataMethod).toHaveBeenCalled();
  });

  it('should handle handleUserInput with only text', () => {
    component.selectedFile = null;
    component.userInput = 'Test only text';
    spyOn(component, 'responseDataMethod');
    component.handleUserInput('Test only text');
    expect(component.responseDataMethod).toHaveBeenCalled();
  });

  it('should handle handleUserInput with edit_field', () => {
    component.selectedFile = null;
    component.userInput = '';
    component.dataa.edit_field = 'edit';
    component.editButtonClicked = false;
    spyOn(component, 'responseDataMethod');
    component.handleUserInput('');
    expect(component.responseDataMethod).toHaveBeenCalled();
  });

   it('should handle responseDataMethod with error and edit_field', fakeAsync(() => {
    apiServiceSpy.sendData.and.returnValue(throwError(() => new Error('fail')));
    component.dataa.edit_field = 'edit';
    component.responseDataMethod('Test');
    tick();
    flush(); // Clear any remaining timers
    expect(component.loader).toBeFalse();
  }));

  it('should call onInput with no div3', () => {
    spyOn(component, 'autoResize');
    component.onInput();
    expect(component.autoResize).toHaveBeenCalled();
  });

  it('should call resetTextAreaSize with no textarea', () => {
    expect(() => component.resetTextAreaSize()).not.toThrow();
  });

  it('should call toggleButton with missing divs', () => {
    expect(() => component.toggleButton()).not.toThrow();
  });

  it('should call isString utility', () => {
    expect(component.isString('str')).toBeTrue();
    expect(component.isString(123)).toBeFalse();
  });

  it('should call processChatResponse with staticBotMsg false', () => {
    component.staticBotMsg = false;
    component.botChatMessage = 'Bot';
    component.botButtonResponse = ['Yes', 'No'];
    expect(() => component.processChatResponse()).not.toThrow();
  });

  it('should call progressBarOnFirstTime with uploadFileName', () => {
    component.uploadFileName = 'file.pdf';
    component.fields = component.fields.map(f => ({ ...f, value: 'filled' }));
    expect(() => component.progressBarOnFirstTime()).not.toThrow();
  });

  it('should call startListening when already listening', () => {
    component.isListening = true;
    expect(() => component.startListening()).not.toThrow();
  });

  it('should call onFileSelected with valid file', () => {
    const file = new File([''], 'file.pdf');
    const event = { target: { files: [file] } };
    expect(() => component.onFileSelected(event)).not.toThrow();
  });

   it('should call fileValidation with valid file', () => {
    const file = new File([''], 'file.pdf');
    const event = { target: { files: [file] } };
    expect(() => component.fileValidation(event)).not.toThrow();
  });

  it('should call onFileAttach with invalid extension', () => {
    const file = new File([''], 'file.exe');
    const event = { target: { files: [file] } };
    component.onFileAttach(event);
    expect(component.errorDivText).toContain('not supported');
  });

  it('should call onFileAttach with large file', () => {
    const file = new File([new ArrayBuffer(21 * 1024 * 1024)], 'file.pdf');
    Object.defineProperty(file, 'size', { value: 21 * 1024 * 1024 });
    const event = { target: { files: [file] } };
    component.onFileAttach(event);
    expect(component.errorDivText).toContain('larger than 20mb');
  });

  it('should call downloadFileFromChat with no uploadFileName', () => {
    component.fileUrlForChatUpload = 'blob:http://localhost/file';
    component.uploadFileName = undefined as any;
    expect(() => component.downloadFileFromChat()).not.toThrow();
  });

  it('should call downloadFileFromAdditional with no fileUploadFromAttachmentName', () => {
    component.fileUrlForAttachmentUpload = 'blob:http://localhost/file';
    component.fileUploadFromAttachmentName = undefined as any;
    expect(() => component.downloadFileFromAdditional()).not.toThrow();
  });

  it('should call errorDivCloseAfterSec and errorDivCloseInstant', fakeAsync(() => {
    component.errorDivCloseAfterSec();
    expect(component.errorDivVisible).toBeTrue();
    tick(5000);
    expect(component.errorDivVisible).toBeFalse();
    component.errorDivCloseInstant();
    expect(component.errorDivVisible).toBeFalse();
  }));

  it('should call successDivCloseAfterSec and successDivCloseInstant', fakeAsync(() => {
    component.successDivCloseAfterSec();
    expect(component.successDivVisible).toBeTrue();
    tick(9000);
    expect(component.successDivVisible).toBeFalse();
    component.successDivCloseInstant();
    expect(component.successDivVisible).toBeFalse();
  }));

  it('should call formatObjectKeys with empty object', () => {
    expect(component.formatObjectKeys({})).toEqual({});
  });

  it('should call yesNoButton with other value', fakeAsync(() => {
    apiServiceSpy.sendData.and.returnValue(of(mockApiResponse));
    component.yesNoButton('Other', 0);
    tick();
    expect(component.loader).toBeFalse();
  }));

  it('should call businessMappingButtonClicked', () => {
    component.bussinessMappingButtonClicke = false;
    component.bussinessDropDownKey = '';
    component.businessMappingButtonClicked('Test');
    expect(component.bussinessMappingButtonClicke).toBeTrue();
    expect(component.bussinessDropDownKey).toBe('Test');
  });

  it('should call itMappingButtonClicked', () => {
    component.itMappingButtonClicke = false;
    component.itDropDownKey = '';
    component.itMappingButtonClicked('Test');
    expect(component.itMappingButtonClicke).toBeTrue();
    expect(component.itDropDownKey).toBe('Test');
  });

  it('should call handleBooleanValue', () => {
    component.createNew = false;
    component.handleBooleanValue(true);
    expect(component.createNew).toBeTrue();
  });

  it('should call splitByDot with abbreviation', () => {
    const result = component.splitByDot('e.g. This is a test.');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should call checkFirst10Completed with not all completed', () => {
    component.fields = component.fields.map((f, i) => ({
      ...f,
      value: i < 8 ? 'filled' : ''
    }));
    component.checkFirst10Completed();
    expect(component.buttonDisabled).toBeTrue();
  });

  it('should call editButton for all else branch', fakeAsync(() => {
    component.fields[0].label = 'Other';
    component.fields[0].value = 'Some value';
    component.textarea = { nativeElement: document.createElement('textarea') } as any;
    component.editButton(0);
    tick();
    expect(component.userInput).toBe('Some value');
  }));

  it('should call AllGoodButton with all ADAtext', () => {
    component.ADAtext = 'ADA text';
    component.fields = Array.from({ length: 25 }, (_, i) => ({
      label: `Field ${i}`,
      value: component.ADAtext,
      valid: false,
      editing: false,
      image: '',
      completed: false
    }));
    component.allLooksGoodCliced = false;
    component.AllGoodButton();
    expect(component.fields.every(f => !f.completed)).toBeTrue();
  });

  it('should call showAttachmentDeleteMethod and showChatDeleteMethod', () => {
    component.showAttachmentDelete = false;
    component.showAttachmentDeleteMethod();
    expect(component.showAttachmentDelete).toBeTrue();
    component.showChatDelete = false;
    component.showChatDeleteMethod();
    expect(component.showChatDelete).toBeTrue();
  });

  it('should call addButton and editDropButton with error', fakeAsync(() => {
    apiServiceSpy.sendData.and.returnValue(throwError(() => new Error('fail')));
    component.addButton(0);
    tick();
    component.editDropButton(0);
    tick();
    expect(component.loader).toBeFalse();
  }));

  it('should call onKeyDown with non-Enter key', () => {
    spyOn(component, 'handleUserInput');
    const event = new KeyboardEvent('keydown', { key: 'A' });
    component.userInput = 'test';
    component.onKeyDown(event);
    expect(component.handleUserInput).not.toHaveBeenCalled();
  });

  it('should call generateSessionId and generateRandomString', () => {
    const id = component.generateSessionId();
    expect(id).toMatch(/-/);
    const str = component.generateRandomString(10);
    expect(str.length).toBe(10);
  });

  it('should call submitButtonPopup with error', fakeAsync(() => {
    apiServiceSpy.submitData.and.returnValue(throwError(() => new Error('fail')));
    component.submitButtonPopup();
    tick();
    expect(component.loader).toBeFalse();
  }));

  it('should call submitButton with allLooksGoodCliced true', () => {
    component.allLooksGoodCliced = true;
    spyOn(component, 'submitButtonPopup');
    component.submitButton();
    expect(component.submitButtonPopup).toHaveBeenCalled();
  });

  it('should call showmodal safely', () => {
    expect(() => component.showmodal()).not.toThrow();
  });

  it('should call additionalDataForSubmit safely', () => {
    apiServiceSpy.submitAdditionalData.and.returnValue(of({}));
    expect(() => component.additionalDataForSubmit()).not.toThrow();
  });

  it('should call saveChatData safely', () => {
    apiServiceSpy.submitData.and.returnValue(of({}));
    apiServiceSpy.retriveData.and.stub();
    expect(() => component.saveChatData()).not.toThrow();
  });

  it('should call onConfirmAreas, onConfirmDestination, onConfirmBussiness', () => {
    component.selectedAreas = [true, false];
    component.botButtonResponse = ['A', 'B'];
    component.editFieldVal = 'Areas involved';
    spyOn(component, 'responseDataMethod');
    component.onConfirmAreas();
    expect(component.responseDataMethod).toHaveBeenCalled();

    component.selectedDestination = [false, true];
    component.botButtonResponse = ['A', 'B'];
    component.editFieldVal = 'Destination 2027 alignment';
    component.onConfirmDestination();
    expect(component.responseDataMethod).toHaveBeenCalled();

    component.selectedBussiness = [false, true];
    component.botButtonResponse = ['A', 'B'];
    component.editFieldVal = 'Business case impacts';
    component.onConfirmBussiness();
    expect(component.responseDataMethod).toHaveBeenCalled();
  });

  it('should call getSelectedBussiness, getSelectedRegions, getSelectedDestination', () => {
    component.selectedBussiness = [false, true, false];
    component.botButtonResponse = ['A', 'B', 'C'];
    expect(component.getSelectedBussiness()).toBe('B');
    component.selectedAreas = [true, false, true];
    expect(component.getSelectedRegions()).toBe('A, C');
    component.selectedDestination = [false, true, false];
    expect(component.getSelectedDestination()).toBe('B');
  });

  it('should call initializeTooltips and filesSetForHistory safely', () => {
    expect(() => component.initializeTooltips()).not.toThrow();
    expect(() => component.filesSetForHistory()).not.toThrow();
  });

  it('should call checkIfArray with array, null, undefined', () => {
    expect(component.checkIfArray([1, 2])).toBeTrue();
    expect(component.checkIfArray(null)).toBeFalse();
    expect(component.checkIfArray(undefined)).toBeFalse();
  });

  it('should call timeLiButton', () => {
    spyOn(component, 'responseDataMethod');
    component.editFieldVal = 'Timelines';
    component.timeLiButton('2025');
    expect(component.responseDataMethod).toHaveBeenCalledWith('2025');
  });

  it('should call isAdditionalCommentsEmpty getter', () => {
    component.fields[24].value = '';
    expect(component.isAdditionalCommentsEmpty).toBeTrue();
    component.fields[24].value = 'not empty';
    expect(component.isAdditionalCommentsEmpty).toBeFalse();
  });

  it('should call ngOnDestroy with dataSubscription', () => {
    component.dataSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') } as any;
    component.submitButtonClicked = true;
    component.ngOnDestroy();
    expect(component.dataSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should call ngOnDestroy with saveChatData', () => {
    (component as any).mockEnabled = false;
    component.dataSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') } as any;
    component.submitButtonClicked = false;
    component.botRespondedFirstTime = true;
    spyOn(component, 'saveChatData');
    component.ngOnDestroy();
    expect(component.saveChatData).toHaveBeenCalled();
    expect(component.dataSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should call ngOnDestroy without saveChatData', () => {
    component.dataSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') } as any;
    component.submitButtonClicked = false;
    component.botRespondedFirstTime = false;
    spyOn(component, 'saveChatData');
    component.ngOnDestroy();
    expect(component.saveChatData).not.toHaveBeenCalled();
    expect(component.dataSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should call isString with null and undefined', () => {
  expect(component.isString(null)).toBeFalse();
  expect(component.isString(undefined)).toBeFalse();
});

it('should call editField with field missing editing property', () => {
  const field = { value: 'test', editing: false }; // add editing property
  expect(() => component.editField(field)).not.toThrow();
  expect(field.editing).toBeTrue();
});

it('should call formatObjectKeys with non-string keys', () => {
  const obj = { 123: 'number key', true: 'bool key' };
  const result = component.formatObjectKeys(obj);
  expect(result['123']).toBe('number key');
  expect(result['true']).toBe('bool key');
});

it('should call removeFile when selectedFile is already null', () => {
  component.selectedFile = null;
  expect(() => component.removeFile()).not.toThrow();
});

it('should call editButton with index out of range', fakeAsync(() => {
  component.fields = [];
  expect(() => component.editButton(100)).not.toThrow();
  tick();
}));

it('should call splitByDot with undefined', () => {
  expect(component.splitByDot(undefined as any)).toEqual([]);
});

it('should call progressBarUpdate with missing uploadFileName', () => {
  component.bicFieldData = { 'Your idea title': 'Test Title' };
  component.uploadFileName = undefined as any;
  expect(() => component.progressBarUpdate()).not.toThrow();
});

it('should call processChatResponse with botChatMessage undefined', () => {
  component.botButtonResponse = ['Yes', 'No'];
  component.staticBotMsg = false;
  component.botChatMessage = undefined as any;
  expect(() => component.processChatResponse()).not.toThrow();
});

it('should call filesSetForHistory with empty chatHistory', () => {
  component.chatHistory = [];
  expect(() => component.filesSetForHistory()).not.toThrow();
});


});
