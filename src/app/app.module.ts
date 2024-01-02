import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderInterceptor } from './@shared/interceptors/header.interceptor';
import { ToastModalComponent } from './@shared/components/toast-modal/toast-modal.component';
import { SharedModule } from './@shared/shared.module';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserAuthGuard } from './@shared/guards/user-auth.guard';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [AppComponent, ToastModalComponent],
  imports: [
    AppRoutingModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
    provideClientHydration(),
    UserAuthGuard,
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
