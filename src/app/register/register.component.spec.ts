import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { RegisterComponent } from './register.component';
import { AuthService } from '../auth.service';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      register: jasmine.createSpy('register').and.returnValue(of({}))
    };

    routerMock = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock },
        provideRouter([{ path: 'flight-info', component: RegisterComponent }]), // Mock route
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.form).toBeDefined();
    expect(component.form.controls['username']).toBeDefined();
    expect(component.form.controls['email']).toBeDefined();
    expect(component.form.controls['password']).toBeDefined();
  });

  it('should register successfully and navigate to flight-info', () => {
    component.form.setValue({ username: 'TestUser', email: 'test@example.com', password: 'password123' });
    component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalledWith('test@example.com', 'TestUser', 'password123');
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/flight-info');
  });

  it('should set errorMessage on registration failure', () => {
    authServiceMock.register.and.returnValue(throwError({ code: 'auth/error' }));
    component.form.setValue({ username: 'TestUser', email: 'test@example.com', password: 'password123' });
    component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalledWith('test@example.com', 'TestUser', 'password123');
    expect(component.errorMessage).toBe('auth/error');
  });
});
