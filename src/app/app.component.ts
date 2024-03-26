import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { ShareService } from './@shared/services/share.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from './@shared/services/auth.service';
import { CommonService } from './@shared/services/common.service';
import { CookieService } from 'ngx-cookie-service';
import {environment} from 'src/environments/environment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  isShowScrollTopBtn: boolean = false;

  constructor(
    public shareService: ShareService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private commonService: CommonService,
    private cookieService: CookieService
  ) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > 100) {
      this.isShowScrollTopBtn = true;
    } else {
      this.isShowScrollTopBtn = false;
    }
  }

  ngOnInit(): void {
    const authToken = localStorage.getItem('auth-token');
    if (authToken) {
      this.authService.verifyToken(authToken).subscribe({
        next: (res: any) => {
          if (!res?.verifiedToken) {
            this.logOut();
          }
        },
        error: (err) => {
          this.logOut();
        },
      });
    }
  }

  ngAfterViewInit(): void {
    this.spinner.hide();
    setTimeout(() => {
      const splashScreenLoader = document.getElementById('splashScreenLoader');
      if (splashScreenLoader) {
        splashScreenLoader.style.display = 'none';
      }
    }, 1000);
  }
  logOut(): void {
    this.cookieService.delete('auth-user', '/', environment.domain);
    const url = environment.apiUrl + 'customers/logout';
    this.commonService.get(url).subscribe({
      next: (res) => {
        localStorage.clear();
        sessionStorage.clear();
        location.href = environment.logoutUrl;
      },
    });
  }
}
