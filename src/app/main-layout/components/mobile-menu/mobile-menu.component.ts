import { Component, OnInit } from '@angular/core';
import { VideoPostModalComponent } from 'src/app/@shared/modals/video-post-modal/video-post-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareService } from 'src/app/@shared/services/share.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/@shared/services/auth.service';
@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
})
export class MobileMenuComponent implements OnInit {
  useDetails: any = {};
  channelId: number;
  constructor(
    private modalService: NgbModal,
    private shareService: ShareService,
    private router: Router,
    public authService: AuthService
  ) {
    this.useDetails = JSON.parse(this.authService.getUserData() as any);
  }
  ngOnInit(): void {
    this.channelId = +localStorage.getItem('channelId');
  }

  openVideoUploadPopUp(): void {
    const modalRef = this.modalService.open(VideoPostModalComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.title = `Upload Video`;
    modalRef.componentInstance.confirmButtonLabel = 'Upload Video';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.result.then((res) => {
      // console.log(res);
    });
  }

  getmyChannel() {
    const unique_link = this.shareService.channelData.unique_link;
    this.router.navigate([`channel/${unique_link}`], {
      state: { data: unique_link },
    });
  }

  isUserMediaApproved(): boolean {
    return this.useDetails?.MediaApproved === 1;
  }
}
