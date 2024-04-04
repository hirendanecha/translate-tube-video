import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BreakpointService } from 'src/app/@shared/services/breakpoint.service';
import { ShareService } from 'src/app/@shared/services/share.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/@shared/services/auth.service';
import { VideoPostModalComponent } from 'src/app/@shared/modals/video-post-modal/video-post-modal.component';
import { NotificationsModalComponent } from '../notifications-modal/notifications-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userDetails: any;
  apiUrl = environment.apiUrl + 'customers/logout';
  userMenusOverlayDialog: any;

  constructor(
    public shareService: ShareService,
    private breakpointService: BreakpointService,
    private offcanvasService: NgbOffcanvas,
    private commonService: CommonService,
    private cookieService: CookieService,
    public authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
  ) {
    const isRead = localStorage.getItem('isRead');
    if (isRead === 'N') {
      this.shareService.isNotify = true;
    }
  }

  ngOnInit(): void {
    this.userDetails = JSON.parse(this.authService.getUserData() as any);
  }

  ngAfterViewInit(): void {
  }

  myAccountNavigation(): void {
    const id = this.shareService.userDetails.Id
    // location.href = `https://freedom.buzz/settings/view-profile/${id}`;
    const url = `https://translate.tube/settings/view-profile/${id}`;
    window.open(url, "_blank");
  }

  toggleSidebar(): void {
    if (this.breakpointService.screen.getValue().md.gatherThen) {
      this.shareService.toggleSidebar();
    } else {
      this.offcanvasService.open(SidebarComponent);
    }
  }

  logout(): void {
    // this.isCollapsed = true;
    this.cookieService.delete('auth-user', '/', environment.domain);
        localStorage.clear();
        sessionStorage.clear();
        location.href = environment.logoutUrl;
   
  }

  isUserMediaApproved(): boolean {
    return this.userDetails?.MediaApproved === 1;
  }

  openVideoUploadPopUp(): void {
    const modalRef = this.modalService.open(VideoPostModalComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.title = `Upload Video`;
    modalRef.componentInstance.confirmButtonLabel = 'Upload Video';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.result.then(res => {
      console.log(res)
    })
  }

  openNotificationsModal(): void {
    this.userMenusOverlayDialog = this.modalService.open(NotificationsModalComponent, {
      keyboard: true,
      modalDialogClass: 'notifications-modal',
    });
  }
}
