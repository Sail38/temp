import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { afterNextRender } from '@angular/core'; 

interface FlightInfoPayload {
  airline: string;
  arrivalDate: string;
  arrivalTime: string;
  flightNumber: string;
  numOfGuests: number;
  comments?: string;
}

@Component({
  standalone: true,
  selector: 'app-flight-info',
  templateUrl: './flight-info.component.html',
  styleUrls: ['./flight-info.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [HttpClient]
})
export class FlightInfoComponent implements OnInit{
  
  formSubmitted = false;
  formSuccess  = false;
  formError = false; 
  
  flightForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.flightForm = this.fb.group({
      airline: ['', Validators.required],
      arrivalDate: ['', Validators.required],
      arrivalTime: ['', Validators.required],
      flightNumber: ['', Validators.required],
      numOfGuests: [0, [Validators.required, Validators.min(1)]],
      comments: ['']
    });

    afterNextRender(() => {
      this.authService.user$.subscribe((user: { email: string; displayName: string; }) => {
        if(user){
          this.authService.currentUserSig.set({
            email: user.email!,
            username: user.displayName!            
          });          
        }else {
          this.authService.currentUserSig.set(null);
        }
  
        console.log(this.authService.currentUserSig());
      })
    })
  }

  authService = inject(AuthService);
  ngOnInit(): void {}

  onSubmit() {
    this.formSubmitted = true;
    
    if (this.flightForm.valid) {
      const payload: FlightInfoPayload = this.flightForm.value;
      const headers = new HttpHeaders({
        'token': this.authService.getToken(),
        'candidate': this.authService.getCandidate()
      });

      this.http.post(this.authService.getApiBaseUrl(), payload, { headers })
        .subscribe(response => {
          console.log('Form Submitted Successfully', response);
          this.formSuccess = true;
          this.formError = false;
        }, error => {
          console.error('Form Submission Failed', error);
          this.formError = true;
          this.formSuccess = false;
        });
    } else {
      this.formSuccess = false;
      console.log('Form is invalid');      
    }
  }
}
