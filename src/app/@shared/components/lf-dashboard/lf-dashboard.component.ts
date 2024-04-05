import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { environment } from 'src/environments/environment';
import {
  NgbActiveModal,
  NgbDropdown,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { VideoPostModalComponent } from '../../modals/video-post-modal/video-post-modal.component';
import { CreateChannelComponent } from '../../modals/create-channel/create-channel-modal.component';
import { ConferenceLinkComponent } from '../../modals/create-conference-link/conference-link-modal.component';
import { ShareService } from '../../services/share.service';

@Component({
  selector: 'app-lf-dashboard',
  templateUrl: './lf-dashboard.component.html',
  styleUrls: ['./lf-dashboard.component.scss'],
})
export class LfDashboardComponent implements OnInit {
  @ViewChild('userSearchDropdownRef', { static: false, read: NgbDropdown })
  @Output('onSearchData')
  onSearchData: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchTextEmitter: EventEmitter<string> = new EventEmitter();

  userSearchNgbDropdown: NgbDropdown;
  userList: any = [];
  channelName = '';
  searchText: string = '';
  useDetails: any = {};
  apiUrl = environment.apiUrl;
  channelId: any;
  channelData: any = {};
  channelList: any = [];

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    public shareService: ShareService,
    public authService: AuthService,
    public modalService: NgbModal,
    private router: Router
  ) {
    this.useDetails = JSON.parse(this.authService.getUserData() as any);
    // this.getChannelByUserId(this.useDetails?.UserID);
    this.route.paramMap.subscribe((paramMap) => {
      // https://facetime.opash.in/
      const name = paramMap.get('name');
      if (name) {
        this.channelName = name;
        this.getChannelDetails(name);
      }
    });
    const queryParams = this.route.snapshot.queryParams;
    const newParams = { ...queryParams };
    // console.log(newParams)
    // this.channelId = this.shareService?.channelData?.id;
    // this.route.queryParams.subscribe((params: any) => {
    //   console.log(params.channelId);
    if (newParams['channelId']) {
      this.channelId = newParams['channelId'];
      delete newParams['channelId']
      const navigationExtras: NavigationExtras = {
        queryParams: newParams
      };
      this.router.navigate([], navigationExtras);
    }
    // else {
    // }
    // });
  }

  ngOnInit(): void {
    // console.log(this.channelId)
    if (!this.channelId) {
      this.channelId = +localStorage.getItem('channelId');
    }
    this.getChannels();

  }

  getChannelDetails(value): void {
    this.commonService.get(`${this.apiUrl}channels/${value}`).subscribe({
      next: (res) => {
        // console.log(res.data);
        if (res.data.length) {
          this.channelData = res.data[0];
          // console.log(this.channelData);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  openWebRtc(): void {
    const webRtcUrl = `${environment.conferenceUrl}${this.channelName}`;
    window.open(webRtcUrl, '_blank');
  }

  getSearchData(searchText): void {
    this.searchTextEmitter?.emit(searchText);
    this.searchText = ''
  }

  openProfile(Id): void {
    const url = `https://translate.tube/settings/view-profile/${Id}`;
    window.open(url, '_blank');
  }

  isUserMediaApproved(): boolean {
    return this.shareService.userDetails.MediaApproved === 1;
    // return this.useDetails?.MediaApproved === 1;
  }

  openVideoUploadPopUp(): void {
    const modalRef = this.modalService.open(VideoPostModalComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.title = `Upload Video`;
    modalRef.componentInstance.confirmButtonLabel = 'Upload Video';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.componentInstance.channelList = this.channelList;

    modalRef.result.then((res) => {
      window.location.reload();
      // console.log(res);
    });
  }

  createChannel(): void {
    const modalRef = this.modalService.open(CreateChannelComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.title = `Create Channel`;
    modalRef.componentInstance.confirmButtonLabel = 'Save';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.result.then((res) => {
      if (res === 'success') {
      }
    });
  }

  openConferencePopUp(): void {
    const modalRef = this.modalService.open(ConferenceLinkComponent, {
      centered: true,
      size: 'md',
    });
  }

  getmyChannel(link): void {
    const unique_link = link || this.shareService.channelData.unique_link;
    this.router.navigate([`channel/${unique_link}`], {
      state: { data: unique_link },
    });
  }

  getChannels(): void {
    const userId = JSON.parse(this.authService.getUserData() as any)?.UserID;
    const apiUrl = `${environment.apiUrl}channels/get-channels/${userId}`;
    this.commonService.get(apiUrl).subscribe({
      next: (res) => {
        this.channelList = res.data;
        console.log(this.channelList);
      },
      error(err) {
        console.log(err);
      },
    });
  }
}
