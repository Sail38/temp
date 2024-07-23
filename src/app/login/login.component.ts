import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./login.component.css'],
})

export class LoginComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  errorMessage: string | null = null;

  onSubmit(): void {
    const rawform = this.form.getRawValue();
    this.authService.login(rawform.email, rawform.password)
    .subscribe(
      {
        next: () => {
          this.router.navigateByUrl('/flight-info');
        },
        error: (err) => { this.errorMessage = err.code; }
      }
      
      );
  }
}