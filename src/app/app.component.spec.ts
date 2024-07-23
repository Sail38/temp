import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceMock: any;
  let userSubject: BehaviorSubject<any>;

  beforeEach(async () => {

    userSubject = new BehaviorSubject({ email: 'test@example.com', displayName: 'Test User' });

    authServiceMock = {
      user$: userSubject.asObservable(),
      currentUserSig: signal(null),
      logout: jasmine.createSpy('logout'),
    };

    spyOn(authServiceMock.currentUserSig, 'set').and.callThrough();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ActivatedRoute, useValue: {} }        
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
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

  it('should call authService.logout when logout is called', () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});
