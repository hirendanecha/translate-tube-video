import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { urlConstant } from '../constant/urlConstant';
import { CommonService } from './common.service';
import { ToastService } from './toast.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // admin: BehaviorSubject<any>;
  userDetails: any = {};
  user: BehaviorSubject<any>;
  token: BehaviorSubject<any>;

  constructor(
    private commonService: CommonService,
    private toastService: ToastService,
    private cookieService: CookieService
  ) {

    // const adminJson = localStorage.getItem('adminAuth') ? JSON.parse(localStorage.getItem('adminAuth') || '') : {};
    // this.admin = new BehaviorSubject<any>(adminJson);
    const userJson = localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser') as any) : {};
    this.user = new BehaviorSubject<any>(userJson);
    // this.token = new BehaviorSubject<any>(this.cookieService.get('token') ? this.cookieService.get('token') : '');
  }

  adminData(): any {
    // return this.admin.getValue() || {};
  }

  adminId(): any {
    const adminData = this.adminData();
    return adminData['_id'];
  }

  // adminLogin(adminJson: any = {}): Observable<any> {
  //     localStorage.clear();
  //     localStorage.setItem('adminAuth', JSON.stringify(adminJson));
  //     localStorage.setItem('token', adminJson?.token);

  //     if (!!adminJson) {
  //         this.admin.next(adminJson);
  //         this.token.next(adminJson?.token)
  //     }

  //     return of(true);
  // }

  // adminLogout(): void {
  //     const reqBody = {
  //         _id: this.adminId()
  //     };

  //     this.commonService.post(urlConstant.Auth.AdminLogout, reqBody).subscribe((res) => {
  //         this.toastService.success(`Logout successfully.`);
  //         this.clearData();
  //         window.location.href = '/auth/login';
  //     });
  // }

  userData(): any {
    return this.user?.getValue() || {};
  }

  userId(): any {
    const userData = this.userData();
    return userData['_id'];
  }

  // userLogin(userJson: any = {}): Observable<any> {
  //     localStorage.clear();
  //     localStorage.setItem('auth-user', JSON.stringify(userJson));

  //     if (!!userJson) {
  //         this.user.next(userJson);
  //         this.setToken(userJson?.token)
  //     }

  //     return of(true);
  // }

  userLogout(): void {
    const reqBody = {
      _id: this.userId()
    };

    this.commonService.post(urlConstant.Auth.Logout, reqBody).subscribe((res) => {
      this.toastService.success(`Logout successfully.`);
      this.clearData();
      window.location.href = '';
    });
  }

  clearData(): void {
    localStorage.clear();
    // this.admin.next(null);
    this.user?.next(null);
  }

  setToken(token: string = ''): void {
    localStorage.setItem('token', token);
    this.token?.next(token);
  }

  getToken(): string {
    return '';
    // return this.token?.getValue() || '';
  }

  setUserSignEmail(email: string = ''): void {
    localStorage.setItem('userEmail', email);
  }

  getUserSignEmail(): string {
    return localStorage.getItem('userEmail') || '';
  }

  // refreshUserData(): Observable<any> {
  //     return this.commonService.get(urlConstant.User.GetByToken).pipe(
  //         take(1),
  //         switchMap((res: any = {}) => {
  //             if (!!res && res['status'] === 200) {
  //                 return this.userLogin(res['data']).pipe(take(1));
  //             } else {
  //                 return of(res);
  //             }
  //         })
  //     );
  // }

  setUserData(userDetails: any) {
    // localStorage.setItem('authUser', JSON.stringify(userDetails));
  }

  getUserData() {
    return localStorage.getItem('authUser')
  }
}
