import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideClientHydration } from '@angular/platform-browser';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimations } from '@angular/platform-browser/animations';



const firebaseConfig = {
  apiKey: "AIzaSyBkRy04OUkhYJFcG5v-p5lGzmGUJ3iicqI",
  authDomain: "mrg-auth-test-2ae9f.firebaseapp.com",
  projectId: "mrg-auth-test-2ae9f",
  storageBucket: "mrg-auth-test-2ae9f.appspot.com",
  messagingSenderId: "827858507041",
  appId: "1:827858507041:web:e03c73b265ee54c5c2da60"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
      provideFirebaseApp(
        () => initializeApp(firebaseConfig)
      ), 
      provideFirestore(
        () => getFirestore()
      ), 
      provideStorage(
        () => getStorage()
      ), 
      provideAuth(
        () => getAuth()
      ),
    provideAnimations(),
    provideHttpClient(),
    DatePipe
  ],
};