import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FlightInfoComponent } from './flight-info.component';
import { AuthService } from '../auth.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { signal } from '@angular/core';

describe('FlightInfoComponent', () => {
  let component: FlightInfoComponent;
  let fixture: ComponentFixture<FlightInfoComponent>;
  let authServiceMock: any;
  let httpMock: HttpTestingController;
  let userSubject: BehaviorSubject<any>;

  beforeEach(async () => {

    userSubject = new BehaviorSubject({ email: 'test@example.com', displayName: 'Test User' });

    authServiceMock = {
      user$: userSubject.asObservable(),
      currentUserSig: signal(null),
      getToken: jasmine.createSpy('getToken').and.returnValue('test-token'),
      getApiBaseUrl: jasmine.createSpy('getApiBaseUrl').and.returnValue('http://api.abc.com'),
      getCandidate: jasmine.createSpy('getCandidate').and.returnValue('test-candidate')
    };

    spyOn(authServiceMock.currentUserSig, 'set').and.callThrough();

    await TestBed.configureTestingModule({
      imports: [
        FlightInfoComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FlightInfoComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.flightForm).toBeDefined();
    expect(component.flightForm.controls['airline']).toBeDefined();
    expect(component.flightForm.controls['arrivalDate']).toBeDefined();
    expect(component.flightForm.controls['arrivalTime']).toBeDefined();
    expect(component.flightForm.controls['flightNumber']).toBeDefined();
    expect(component.flightForm.controls['numOfGuests']).toBeDefined();
    expect(component.flightForm.controls['comments']).toBeDefined();
  });

  it('should set currentUserSig when user is present', () => {
    expect(authServiceMock.currentUserSig.set).toHaveBeenCalledWith({
      email: 'test@example.com',
      username: 'Test User'
    });
  });

  it('should set currentUserSig to null when user is not present', () => {
    userSubject.next(null);
    fixture.detectChanges();

    expect(authServiceMock.currentUserSig.set).toHaveBeenCalledWith(null);
  });

  it('should submit the form successfully', () => {
    component.flightForm.setValue({
      airline: 'Test Airline',
      arrivalDate: '2024-07-22',
      arrivalTime: '10:00',
      flightNumber: '1234',
      numOfGuests: 2,
      comments: 'Test comment'
    });

    component.onSubmit();

    const req = httpMock.expectOne('http://api.abc.com');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('token')).toBe('test-token');
    expect(req.request.headers.get('candidate')).toBe('test-candidate');
    req.flush({});

    expect(component.formSuccess).toBeTrue();
    expect(component.formError).toBeFalse();
  });

  it('should handle form submission failure', () => {
    component.flightForm.setValue({
      airline: 'Test Airline',
      arrivalDate: '2024-07-22',
      arrivalTime: '10:00',
      flightNumber: '1234',
      numOfGuests: 2,
      comments: 'Test comment'
    });

    component.onSubmit();

    const req = httpMock.expectOne('http://api.abc.com');
    req.flush('Form Submission Failed', { status: 500, statusText: 'Server Error' });

    expect(component.formSuccess).toBeFalse();
    expect(component.formError).toBeTrue();
  });

  it('should log "Form is invalid" when form is invalid', () => {
    spyOn(console, 'log');
    component.flightForm.setValue({
      airline: '',
      arrivalDate: '',
      arrivalTime: '',
      flightNumber: '',
      numOfGuests: 0,
      comments: ''
    });

    component.onSubmit();

    expect(console.log).toHaveBeenCalledWith('Form is invalid');
  });

});
