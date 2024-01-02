import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/@shared/services/auth.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ShareService } from 'src/app/@shared/services/share.service';
import { SocketService } from 'src/app/@shared/services/socket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  apiUrl = environment.apiUrl + 'channels/';
  channelData: any = {};
  videoList: any = [];
  recommendedVideoList: any = [];
  isNavigationEnd = false;
  activePage = 0;
  activeFeturePage = 0;
  hasMoreData = false;
  hasRecommendedData = false;
  channelName = '';
  profileId: number;
  userId: number;
  channelId: number;
  receivedSearchText: string = '';
  activeTab: string = 'Channels';
  searchChannelData: any = [];
  searchPostData: any = [];
  searchResults: number;

  notificationId: number;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private socketService: SocketService,
    private authService: AuthService,
    private shareService: ShareService
  ) {
    this.profileId = JSON.parse(this.authService.getUserData() as any)?.Id;
    this.userId = JSON.parse(this.authService.getUserData() as any)?.UserID;
    this.channelId = +localStorage.getItem('channelId');

    this.route.paramMap.subscribe((paramMap) => {
      // https://facetime.opash.in/
      const name = paramMap.get('name');
      this.channelName = name;
      this.videoList = [];
      if (name) {
        this.channelName = name;
        this.getChannelDetails(name);
        if (this.searchResults) {
          this.searchChannelData = null;
          this.searchPostData = null;
          this.searchResults = null;
        }
      } else {
        this.getChannelByUserId(this.userId);
      }
    });
  }

  ngOnInit() {
    this.recommendedLoadMore();
  }

  ngAfterViewInit(): void {
    if (!this.socketService?.socket?.connected) {
      this.socketService?.socket?.connect();
    }

    this.socketService?.socket?.emit('join', { room: this.profileId });
    this.socketService?.socket?.on('notification', (data: any) => {
      console.log(data);
      if (data) {
        this.notificationId = data.id;
        this.shareService.isNotify = true;
        if (this.notificationId) {
          this.commonService.getNotification(this.notificationId).subscribe({
            next: (res) => {
              console.log(res);
              localStorage.setItem('isRead', res.data[0]?.isRead);
            },
            error: (error) => {
              console.log(error);
            },
          });
        }
      }
    });
    const isRead = localStorage.getItem('isRead');
    if (isRead === 'N') {
      this.shareService.isNotify = true;
    }
  }

  getChannelByUserId(value): void {
    this.commonService.get(`${this.apiUrl}my-channel/${value}`).subscribe({
      next: (res) => {
        // console.log(res.data);
        if (res) {
          this.channelData = res[0];
          // localStorage.setItem('channelId', this.channelData.id);
          // console.log(this.channelData);
          this.getPostVideosById();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getChannelDetails(value): void {
    this.commonService.get(`${this.apiUrl}${value}`).subscribe({
      next: (res) => {
        // console.log(res.data);
        if (res.data.length) {
          this.channelData = res.data[0];
          // console.log(this.channelData);
          this.getPostVideosById();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  // getPostVideosById(): void {
  //   this.commonService
  //     .post(this.apiUrl, { id: this.channelData?.profileid, size: 10, page: this.activePage })
  //     .subscribe({
  //       next: (res: any) => {
  //         this.videoList = res.data;
  //         console.log(res);
  //       },
  //       error: (error) => {
  //         console.log(error);
  //       },
  //     });
  // }

  getPostVideosById(): void {
    this.activePage = 0;
    if (this.channelData?.profileid) {
      this.loadMore();
    }
  }

  loadMore() {
    this.activePage++;
    this.spinner.show();
    this.commonService
      .post(`${this.apiUrl}my-posts`, {
        id: this.channelData?.id,
        size: 12,
        page: this.activePage,
      })
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res?.data?.length > 0) {
            this.videoList = this.videoList.concat(res.data);
            this.hasMoreData = false;
          } else {
            this.hasMoreData = true;
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
        },
      });
  }

  recommendedLoadMore() {
    this.activeFeturePage++;
    this.spinner.show();
    this.commonService
      .post(`${this.apiUrl}posts`, {
        id: this.channelData?.id,
        size: 12,
        page: this.activeFeturePage,
      })
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res?.data?.length > 0) {
            this.recommendedVideoList = this.recommendedVideoList.concat(
              res.data
            );
            this.hasRecommendedData = false;
          } else {
            this.hasRecommendedData = true;
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
        },
      });
  }
  switchTab(tabName: string) {
    this.activeTab = tabName;
    console.log(tabName);
  }

  onSearchData(searchText: string) {
    this.spinner.show();
    this.commonService
      .post(`${this.apiUrl}search-all`, { search: searchText })
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.searchChannelData = res.channels;
          this.searchPostData = res.posts;
          this.searchResults =
            this.searchChannelData.length + this.searchPostData.length;
          if (res.channels.length === 0) {
            this.activeTab = 'Videos';
          }
          // console.log(this.searchResults);
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
        },
      });
  }

  clearSearchData() {
    this.searchChannelData = null;
    this.searchPostData = null;
    this.searchResults = null;
  }
}
