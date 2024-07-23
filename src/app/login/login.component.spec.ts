import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(of({}))
    };

    routerMock = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock },
        provideRouter([{ path: 'flight-info', component: LoginComponent }]), // Mock route
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.form).toBeDefined();
    expect(component.form.controls['email']).toBeDefined();
    expect(component.form.controls['password']).toBeDefined();
  });

  it('should login successfully and navigate to flight-info', () => {
    component.form.setValue({ email: 'test@example.com', password: 'password123' });
    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/flight-info');
  });

  it('should set errorMessage on login failure', () => {
    authServiceMock.login.and.returnValue(throwError({ code: 'auth/error' }));
    component.form.setValue({ email: 'test@example.com', password: 'password123' });
    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(component.errorMessage).toBe('auth/error');
  });
});
