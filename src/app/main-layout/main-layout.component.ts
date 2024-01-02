import { Component, OnInit } from '@angular/core';
import { ShareService } from '../@shared/services/share.service';
import { BreakpointService } from '../@shared/services/breakpoint.service';
import { environment } from 'src/environments/environment';
import { CommonService } from '../@shared/services/common.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../@shared/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit{
  tokenData: any;
  constructor(
    public shareService: ShareService,
    public breakpointService: BreakpointService,
    private commonService: CommonService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    const url = environment.apiUrl + 'login/me';
    this.commonService
      .get(url, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          this.spinner.hide()
          this.tokenData = { ...res };
          const auth = this.tokenData?.user;
          const token = this.tokenData?.accessToken;
          const isLogin = (token && auth) ? true : false;
          // this.authService.setUserData(auth)
          this.shareService.getUserDetails(auth?.profileId)
          this.authService.userDetails = auth;
          this.authService.token = token;
          // if (!isLogin) {
          //   location.href = environment?.loginUrl;
          // }
        },
        error: (err) => {
          this.spinner.hide();
          // window.location.href = environment?.loginUrl;
          console.log(err);
        },
      });
    
  }
}
