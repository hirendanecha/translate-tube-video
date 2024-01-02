import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';

@Injectable()
export class UserAuthGuard implements CanActivate {
    environment = environment;
    tokenData: any;
    constructor(
        private authService: AuthService,
        private commonService: CommonService,
        private router: Router
    ) {
    }

    canActivate() {
        const auth = this.authService?.userData();
        // const token = this.authService?.token;
        const isLogin = (auth.Id) ? true : false;
        if (isLogin) {
            return true;
        } else {
            window.location.href = environment?.loginUrl;
            return false;
        }
    }
}
