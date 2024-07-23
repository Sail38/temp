import { Injectable, inject, signal } from "@angular/core";
import { Auth, user } from "@angular/fire/auth"
import { UserInfo, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, } from "firebase/auth";
import { Observable, from } from "rxjs";
import { UserInterface } from "./user.interface";
import { environment } from "../environments/environment.development";

@Injectable({
    providedIn:'root'
})

export class AuthService{

    firebaseAuth = inject(Auth);
    user$ = user(this.firebaseAuth)
    currentUserSig = signal<UserInterface | null | undefined>(undefined);


    register (email:string, username:string, password:string): Observable<void> {

        const promiose = createUserWithEmailAndPassword(
            this.firebaseAuth,
            email,
            password,
        ).then( response => updateProfile(response.user, {displayName: username})); 

        return from(promiose);

    }

    login (email: string, password: string ): Observable<void> {
        const promiose = signInWithEmailAndPassword(
            this.firebaseAuth, 
            email, 
            password,
        ).then(() => {});

        return from(promiose);
    }

    logout(): Observable<void> {

        const promise = signOut(this.firebaseAuth);
        return from(promise); 
    }

    getToken(): string {
        return environment.token;
      }

    getApiBaseUrl(): string {
        return environment.apiBaseUrl;
      }
      
    getCandidate(): string {
        return environment.candidate;
      }  

}