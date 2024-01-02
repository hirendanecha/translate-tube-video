import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { SocketService } from '../../services/socket.service';
import { CommonService } from '../../services/common.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-video-post-modal',
  templateUrl: './video-post-modal.component.html',
  styleUrls: ['./video-post-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPostModalComponent implements OnInit, AfterViewInit {
  @Input() deleteButtonLabel: string = 'Delete';
  @Input() cancelButtonLabel: string = 'Cancel';
  @Input() confirmButtonLabel: string = 'Confirm';
  @Input() title: string = 'Confirmation Dialog';
  @Input() message: string;
  @Input() data: any;
  @Input() communityId: any;
  postData: any = {
    id: null,
    profileid: null,
    communityId: null,
    postdescription: '',
    tags: [],
    imageUrl: '',
    videoduration: null,
    thumbfilename: null,
    streamname: '',
    posttype: 'V',
    albumname: '',
    file1: {},
    file2: {},
    keywords: '',
  };
  selectedVideoFile: any;
  selectedThumbFile: any;
  postMessageTags: any[];
  postMessageInputValue: string = '';
  apiUrl = environment.apiUrl + 'posts/create-post';
  isProgress = false;
  progressValue = 0;
  interval: any;
  channelId = null;

  streamnameProgress = 0;
  thumbfilenameProgress = 0;

  fileSizeError = false;

  constructor(
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private authService: AuthService,
    private router: Router,
    public modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {
    this.postData.profileid = JSON.parse(
      this.authService.getUserData() as any
    )?.Id;
    // console.log('profileId', this.postData.profileid);
    // console.log('editData', this.data);

    this.channelId = +localStorage.getItem('channelId');

    // console.log(this.channelId);
  }

  ngAfterViewInit(): void {
    if (this.data) {
      this.postData.id = this.data.id;
      this.postData.profileid = this.data.profileid;
      this.postData.albumname = this.data.albumname;
      this.postMessageInputValue = this.data?.postdescription;
      this.selectedThumbFile = this.data?.thumbfilename;
      this.selectedVideoFile = this.data?.streamname;
      // this.postData.streamname = this.selectedVideoFile;
      this.postData.thumbfilename = this.selectedThumbFile;
      this.postData.videoduration = this.data?.videoduration;
      this.postData.keywords = this.data?.keywords;
    }
  }
  ngOnInit(): void {}

  // uploadImgAndSubmit(): void {
  //   if (
  //     this.postData?.profileid &&
  //     this.postData.postdescription &&
  //     this.postData.albumname &&
  //     (this.postData.file1 || this.selectedVideoFile) &&
  //     (this.postData.file2 || this.selectedThumbFile)
  //   ) {
  //     let uploadObs = {};
  //     if (this.postData?.file1?.name) {
  //       uploadObs['streamname'] = this.commonService.upload(
  //         this.postData?.file1
  //       );
  //     }

  //     if (this.postData?.file2?.name) {
  //       uploadObs['thumbfilename'] = this.commonService.upload(
  //         this.postData?.file2
  //       );
  //     }

  //     if (Object.keys(uploadObs)?.length > 0) {
  //       // this.spinner.show();
  //       // this.startProgress();
  //       this.isProgress = true;
  //       forkJoin(uploadObs).subscribe({
  //         next: (res: any) => {
  //           if (res?.streamname?.body?.url) {
  //             this.postData['file1'] = null;
  //             this.postData['streamname'] = res?.streamname?.body?.url;
  //           }

  //           if (res?.thumbfilename?.body?.url) {
  //             this.postData['file2'] = null;
  //             this.postData['thumbfilename'] = res?.thumbfilename?.body?.url;
  //           }

  //           this.spinner.hide();
  //           this.progressValue = 100;
  //           this.createPost();
  //         },
  //         error: (err) => {
  //           this.spinner.hide();
  //         },
  //       });
  //     } else {
  //       this.postData.streamname = this.selectedVideoFile;
  //       this.postData.thumbfilename = this.selectedThumbFile;
  //       this.progressValue = 100;
  //       this.createPost();
  //     }
  //   } else {
  //     this.toastService.danger('Please enter mandatory fields(*) data.');
  //   }
  // }

  // startProgress() {
  //   const interval = setInterval(() => {
  //     if (this.progressValue < 92) {
  //       this.progressValue =
  //         this.progressValue > 92
  //           ? this.progressValue
  //           : this.progressValue + Math.floor(Math.random() * 10);
  //     }
  //     if (this.progressValue >= 98) {
  //       clearInterval(interval);
  //     }
  //     this.cdr.markForCheck();
  //   }, 1000);
  // }

  uploadImgAndSubmit(): void {
    if (
      this.postData?.profileid &&
      this.postData.postdescription &&
      this.postData.albumname &&
      (this.postData.file1 || this.selectedVideoFile) &&
      (this.postData.file2 || this.selectedThumbFile)
    ) {
      if (this.postData?.file1?.name || this.postData?.file2?.name) {
        if (this.postData?.file1?.name) {
          this.isProgress = true;
          this.commonService.upload(this.postData?.file1).subscribe((event) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.streamnameProgress = Math.round(
                (100 * event.loaded) / event.total
              );
              this.cdr.markForCheck();
              this.progressValue = this.streamnameProgress;
              // console.log(`Streamname Progress: ${this.streamnameProgress}%`);
            } else if (event.type === HttpEventType.Response) {
              if (event.body?.url) {
                this.postData['file1'] = null;
                this.postData['streamname'] = event.body.url;
                if (!this.postData.id && this.thumbfilenameProgress === 100 && this.streamnameProgress === 100) {
                  this.createPost();
                } else if (this.postData.id && this.streamnameProgress === 100) {
                  this.createPost();
                }
              }
            }
          });
        }
        if (this.postData?.file2?.name) {
          if (this.postData.id) {
            this.spinner.show();
          }
          this.commonService.upload(this.postData?.file2).subscribe((event) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.thumbfilenameProgress = Math.round(
                (100 * event.loaded) / event.total
              );
              // console.log(
              //   `Thumbfilename Progress: ${this.thumbfilenameProgress}%`
              // );
            } else if (event.type === HttpEventType.Response) {
              if (event.body?.url) {
                this.postData['file2'] = null;
                this.postData['thumbfilename'] = event.body.url;
              }
              if (this.postData?.id && this.thumbfilenameProgress === 100 && !this.streamnameProgress) {
                this.spinner.hide();
                this.postData.streamname = this.selectedVideoFile
                this.createPost();
              }
            }
          });
        }
      } else {
        if (this.postData?.id) {
          this.postData.streamname = this.selectedVideoFile;
          this.postData.thumbfilename = this.selectedThumbFile;
          this.createPost();
        }
      }
    } else {
      this.toastService.danger('Please enter mandatory fields(*) data.');
    }
  }

  onTagUserInputChangeEvent(data: any): void {
    this.postData.postdescription = data?.html;
    this.postMessageTags = data?.tags;
  }

  getTagUsersFromAnchorTags = (anchorTags: any[]): any[] => {
    const tags = [];
    for (const key in anchorTags) {
      if (Object.prototype.hasOwnProperty.call(anchorTags, key)) {
        const tag = anchorTags[key];

        tags.push({
          id: tag?.getAttribute('data-id'),
          name: tag?.innerHTML,
        });
      }
    }

    return tags;
  };

  createPost(): void {
    this.spinner.show();
    if (
      this.postData.streamname &&
      this.postData.thumbfilename &&
      this.postData.postdescription &&
      this.postData.albumname
    ) {
      this.postData['channelId'] = this.channelId || null;
      console.log('post-data', this.postData);
      this.commonService.post(this.apiUrl, this.postData).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          // this.postData = null;
          if (this.postData.id) {
            this.toastService.success('Post updated successfully');
            this.activeModal.close();
          } else {
            this.toastService.success('Post created successfully');
            this.activeModal.close();
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
          this.toastService.danger('Something went wrong please try again!');
        },
      });
      // this.socketService.createOrEditPost(this.postData, (data) => {
      //   this.spinner.hide();
      //   this.toastService.success('Post created successfully.');
      //   this.postData = null;
      //   return data;
      // });
    } else {
      this.spinner.hide();
      // this.toastService.danger('Please enter mandatory fields(*) data.');
    }
  }

  deletePost(): void {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
      size: 'md',
    });
    modalRef.componentInstance.message = `Are you sure want to this video?`;
    modalRef.componentInstance.confirmButtonLabel = 'Delete';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.result.then((res) => {
      // console.log(res);
      if (res === 'success') {
        const postId = this.postData.id;
        this.commonService
          .delete(`${environment.apiUrl}posts/${postId}`)
          .subscribe({
            next: (res: any) => {
              this.toastService.success('Post delete successfully');
              this.activeModal.close();
              window.location.reload();
            },
            error: (res: any) => {
              this.toastService.danger('Something went wrong please try again');
            },
          });
      }
    });
  }

  onSelectedVideo(event: any) {
    // const maxSize = 2*10^9;
    const maxSize = 2147483648; //2GB
    if (event.target?.files?.[0].size < maxSize) {
        this.fileSizeError = false
      if (event.target?.files?.[0].type.includes('video/mp4')) {
        this.postData.file1 = event.target?.files?.[0];
        this.selectedVideoFile = URL.createObjectURL(event.target.files[0]);
        const videoSize = this.postData.file1.size;
        console.log(videoSize);
      } else {
        this.toastService.warring('please upload only mp4 files');
      }
    }else{
      this.toastService.warring('Maximum video size allowed is 2 GB.');
      this.fileSizeError = true
    }
  }

  onFileSelected(event: any) {
    this.postData.file2 = event.target?.files?.[0];
    this.selectedThumbFile = URL.createObjectURL(event.target.files[0]);
  }

  removePostSelectedFile(): void {
    this.selectedThumbFile = null;
  }

  removeVideoSelectedFile(): void {
    this.selectedVideoFile = null;
  }

  onvideoPlay(e: any): void {
    this.postData.videoduration = Math.round(e?.target?.duration);
  }

  goToHome(): void {
    this.activeModal.close();
    location.reload();
  }

  onChangeTag(event) {
    this.postData.keywords = event.target.value.replaceAll(' ', ',');
  }
}
