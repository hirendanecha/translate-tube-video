import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  isSidebarOpen: boolean = true;
  isDarkTheme: boolean = false;
  userDetails: any = {};
  channelData: any = {};
  notificationList: any = [];
  isNotify: boolean;
  userChannelName: string
  isUserAuthenticated: Subject<boolean> = new BehaviorSubject<boolean>(false);
  public _credentials: any = {};

  constructor(
    private commonService: CommonService,
    private authService: AuthService
  ) {
    const theme = localStorage.getItem('theme');
    this.isDarkTheme = (theme === 'dark');
    // this.isDarkTheme = !(theme === 'dark');
    this.toggleTheme();

    const sidebar = localStorage.getItem('sidebar');
    this.isSidebarOpen = (sidebar === 'open');
  }

  openSidebar(): void {
    this.isSidebarOpen = true;
    localStorage.setItem('sidebar', 'open');
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
    localStorage.setItem('sidebar', 'close');
  }

  toggleSidebar(): void {
    if (this.isSidebarOpen) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  toggleTheme(): void {
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      this.isDarkTheme = false;
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      this.isDarkTheme = true;
    }
  }


  // toggleTheme(): void {
  //   if (this.isDarkTheme) {
  //     document.body.classList.remove('dark-theme');
  //     localStorage.setItem('theme', 'light');
  //     this.isDarkTheme = false;
  //   } else {
  //     document.body.classList.add('dark-theme');
  //     localStorage.setItem('theme', 'dark');
  //     this.isDarkTheme = true;
  //   }
  // }

  scrollToTop(): void {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  getUserDetails(id: any): void {
    // const id = JSON.parse(this.authService.getUserData() as any)?.profileId
    const url = environment.apiUrl + `customers/profile/${id}`
    this.commonService.get(url).subscribe({
      next: ((res: any) => {
        localStorage.setItem('authUser', JSON.stringify(res.data[0]));
        this.userDetails = res.data[0]
        this.getChannelByUserId(this.userDetails?.UserID);
      }), error: error => {
        console.log(error)
      }
    })
  }
  getNotificationList() {
    const id = localStorage.getItem('profileId');
    this.commonService.getNotificationList(Number(id)).subscribe({
      next: (res: any) => {
        localStorage.setItem('isRead', 'Y');
        this.isNotify = false;
        this.notificationList = res?.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getChannelByUserId(value): void {
    const url = environment.apiUrl
    this.commonService.get(`${url}channels/my-channel/${value}`).subscribe({
      next: (res) => {
        // console.log(res[0]?.id)
        if (res[0]) {
          this.channelData = res[0];
          this.userChannelName = this.channelData.firstname;
          localStorage.setItem('channelId', res[0]?.id);
          // console.log(this.channelData.firstname);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getCredentials(): any {
    this._credentials = JSON.parse(this.authService.getUserData() as any) || null;
    console.log(this._credentials);
    const isAuthenticate = Object.keys(this._credentials || {}).length > 0;
    this.changeIsUserAuthenticated(isAuthenticate);
    return isAuthenticate;
  }

  changeIsUserAuthenticated(flag: boolean = false) {
    this.isUserAuthenticated.next(flag);
  }
}
