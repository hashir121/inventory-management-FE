import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(), provideToastr({
    positionClass: 'toast-top-right', // ✅ top right corner
    timeOut: 3000,                     // Optional: auto dismiss in 3 seconds
    closeButton: true,                 // Optional: show close icon
    progressBar: true                  // Optional: show progress bar
  }), importProvidersFrom(BrowserAnimationsModule)]
};
