import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/@shared/services/auth.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ToastService } from 'src/app/@shared/services/toast.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  useDetails: any = {};
  selectedFile: any = {};
  postData: any = {
    profileid: '',
    communityId: '',
    file: {},
    streamname: '',
    duration: null,
    thumbfilename: '',
  };
  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  constructor(
    private router: Router,
    private toastService: ToastService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    public authService: AuthService
  ) {
    this.useDetails = JSON.parse(this.authService.getUserData() as any);
    if (this.useDetails?.MediaApproved === 1) {
      return;
    } else {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.postData = {};
    this.selectedFile = null;
  }

  onFileSelected(event: any) {
    if (event.target?.files?.[0].type.includes('video/mp4')) {
      this.postData.file = event.target?.files?.[0];
      this.selectedFile = URL.createObjectURL(event.target.files[0]);
    } else {
      this.toastService.warring('please upload only mp4 files');
    }
  }

  uploadFile() {
    if (this.postData.file) {
      const maxSize = 100 * 1024 * 1024; // 100MB (adjust as needed)
      this.spinner.show();
      if (this.postData.file.size <= maxSize) {
        this.commonService.upload(this.postData?.file).subscribe({
          next: (res: any) => {
            this.spinner.hide();
            if (res?.body) {
              this.postData.streamname = res?.body?.url;
              this.router.navigate(['/upload/details'], {
                state: { data: this.postData },
              });
            }
          },
          error: (error) => {
            this.spinner.hide();
            console.log(error);
          },
        });
      } else {
        this.spinner.hide();
        this.toastService.danger('Invalid file format or size.');
      }
    }
  }

  onVideoPlay(e: any): void {
    this.postData.duration = e.timeStamp;
  }

  removeVideo() {
    this.postData.file = null;
    this.selectedFile = null;
  }
}
