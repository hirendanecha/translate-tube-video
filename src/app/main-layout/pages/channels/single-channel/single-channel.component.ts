import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@shared/services/auth.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-single-channel',
  templateUrl: './single-channel.component.html',
  styleUrls: ['./single-channel.component.scss'],
})
export class SingleChannelComponent implements OnInit {
  useDetails: any = {};
  channelDetails: any = {};
  videoList: any = [];
  apiUrl = environment.apiUrl;
  activeTab = 1;
  constructor(
    private commonService: CommonService,
    public authService: AuthService,
    private router: Router
  ) {
    this.channelDetails = history.state.data;
    this.useDetails = JSON.parse(this.authService.getUserData() as any);
    if (this.useDetails?.MediaApproved === 1) {
     return 
    }else{
      this.router.navigate(['/home'])
    }
  }

  ngOnInit(): void {
    this.getPostVideosById();
  }

  getPostVideosById(): void {
    this.commonService
      .post(`${this.apiUrl}channels/posts`, {
        id: this.channelDetails?.profileid,
        size: 10,
        page: 1,
      })
      .subscribe({
        next: (res: any) => {
          this.videoList = res.data;
          console.log(res);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
