import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  
  authService = inject(AuthService);
  title: any;

  ngOnInit(): void {
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
  }

  logout(): void {
    this.authService.logout();
  }
}