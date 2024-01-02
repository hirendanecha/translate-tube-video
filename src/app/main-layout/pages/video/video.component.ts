import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReplyCommentModalComponent } from 'src/app/@shared/components/reply-comment-modal/reply-comment-modal.component';
import { AuthService } from 'src/app/@shared/services/auth.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ShareService } from 'src/app/@shared/services/share.service';
import { SocketService } from 'src/app/@shared/services/socket.service';
import { ToastService } from 'src/app/@shared/services/toast.service';
import { getTagUsersFromAnchorTags } from 'src/app/@shared/utils/utils';
import { environment } from 'src/environments/environment';
declare var Clappr: any;
declare var jwplayer: any;
@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit, OnChanges {
  @ViewChild('parentPostCommentElement', { static: false })
  parentPostCommentElement: ElementRef;
  @ViewChild('childPostCommentElement', { static: false })
  childPostCommentElement: ElementRef;

  @ViewChild('userSearchDropdownRef', { static: false, read: NgbDropdown })
  userSearchNgbDropdown: NgbDropdown;
  searchText: string = '';
  userSearchList: any = [];

  videoDetails: any = {};
  channelDetails: any = {};
  apiUrl = environment.apiUrl + 'channels';
  commentapiUrl = environment.apiUrl + 'posts';
  searchApi = environment.apiUrl + 'customers/search-user';
  videoList: any = [];

  profileId: number;
  isOpenCommentsPostId: number = null;

  commentList: any = [];
  replyCommentList: any = [];
  isReply = false;
  isReplyComments: boolean = false;
  commentId = null;
  commentData: any = {
    file: null,
    url: '',
    tags: [],
    meta: {},
  };
  isParent: boolean = false;
  postComment = {};
  isCommentsLoader: boolean = false;
  isPostComment: boolean = false;
  player: any;
  // webUrl = environment.webUrl;
  hasMoreData = false;
  activePage: number;
  commentMessageTags = [];
  commentMessageInputValue: string = '';
  constructor(
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private socketService: SocketService,
    public authService: AuthService,
    private renderer: Renderer2,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    public sharedService: ShareService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.profileId = JSON.parse(this.authService.getUserData() as any)?.Id || null;
    if (isPlatformBrowser(this.platformId)) {

      this.route.params.subscribe((params) => {
        const id = +params['id'];
        console.log('>>>>>', id);
        if (id) {
          this.getPostDetailsById(id);
          // this.videoDetails = history?.state?.data;
          // console.log(this.videoDetails);
          // this.viewComments(id);
          // this.playvideo(id);
        }
      });
    }
    // this.router.events.subscribe((event: any) => {
    //   const id = event?.routerEvent?.url.split('/')[1];

    // });
  }
  ngOnChanges(changes: SimpleChanges): void { }

  ngOnInit(): void {
    // this.getMyChannels();
    if (isPlatformBrowser(this.platformId)) {
      this.getPostVideosById();
      this.viewComments(this.videoDetails?.id);
      this.socketListner();
    }
  }

  getMyChannels(): void {
    // this.spinner.show();
    this.commonService
      .getById(
        this.apiUrl,
        { id: this.videoDetails.profileid }
        // this.userData.profileId
      )
      .subscribe({
        next: (res) => {
          this.spinner.hide();
          // console.log(res);
          this.channelDetails = res[0];
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
        },
      });
  }

  getPostDetailsById(id): void {
    this.commonService.get(`${this.apiUrl}/post/${id}`).subscribe({
      next: (res) => {
        this.spinner.hide();
        // console.log(res);
        this.videoDetails = res[0];
        this.playvideo(this.videoDetails.id);
        this.viewComments(this.videoDetails.id);
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  getPostVideosById(): void {
    this.activePage = 0;
    this.loadMore();
    // this.commonService
    //   .post(`${this.apiUrl}/posts`, { size: 15, page: 1 })
    //   .subscribe({
    //     next: (res: any) => {
    //       this.videoList = res.data;
    //       // console.log(res);
    //       // this.playvideo();
    //     },
    //     error: (error) => {
    //       console.log(error);
    //     },
    //   });
  }

  loadMore() {
    this.activePage++;
    // this.spinner.show();
    this.commonService
      .post(`${this.apiUrl}/posts`, { size: 15, page: this.activePage })
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          if (res?.data?.length > 0) {
            this.videoList = this.videoList.concat(res.data);
          } else {
            this.hasMoreData = false;
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
        },
      });
  }

  playvideo(id: any) {
    let i = setInterval(() => {
      if (this.player) {
        this.player.remove();
      }
      // console.log('enter', id);
      const isPhone = window.innerWidth <= 768;
      const config = {
        file: this.videoDetails?.streamname,
        image: this.videoDetails?.thumbfilename,
        mute: false,
        autostart: false,
        volume: 30,
        height: isPhone ? '270px' : '660px',
        // height: '640px',
        width: 'auto',
        pipIcon: 'disabled',
        playbackRateControls: false,
        preload: 'metadata',
        aspectratio: '16:9',
        autoPause: {
          viewability: true,
        },
        events: {
          onError: function (e: any) {
            console.log(e);
          },
        },
      };
      console.log('>>>>> config', JSON.stringify(config));
      this.player = jwplayer('jwVideo-' + id).setup({
        ...config,
      });
      this.player.load();
      console.log('>>>>>', this.player);

      if (this.player) clearInterval(i);
    }, 1000);
  }

  onPostFileSelect(event: any, type: string): void {
    if (type === 'parent') {
      this.isParent = true;
    } else {
      this.isParent = false;
    }
    const file = event.target?.files?.[0] || {};
    if (file?.size < 5120000) {
      if (file.type.includes('image/')) {
        this.commentData['file'] = file;
        this.commentData['imageUrl'] = URL.createObjectURL(file);
      } else {
        this.toastService.danger(`sorry ${file.type} are not allowed!`);
      }
    } else {
      this.toastService.warring('Image is too large!');
    }
  }
  removePostSelectedFile(): void {
    this.commentData['file'] = null;
    this.commentData['imageUrl'] = '';
  }

  commentOnPost(postId, commentId = null): void {
    this.commentData.tags = getTagUsersFromAnchorTags(this.commentMessageTags);
    // const postComment = parentPostCommentElement.innerHTML;
    // console.log(this.commentData);
    if (this.isPostComment === false) {
      if (this.commentData.comment || this.commentData?.file?.name) {
        this.isPostComment = true;
        this.commentData.postId = postId;
        this.commentData.profileId = this.profileId;
        if (commentId) {
          this.commentData['parentCommentId'] = commentId;
        }
        this.addComment();
        this.commentMessageInputValue = null;
      } else {
        this.toastService.danger('Please enter comment');
      }
    }
  }

  // viewComments(id: number): void {
  //   this.isOpenCommentsPostId = id;
  //   this.isCommentsLoader = true;
  //   const data = {
  //     postId: id,
  //     profileId: this.profileId,
  //   };
  //   this.commonService.post(`${this.commentapiUrl}/comments/`, data).subscribe({
  //     next: (res) => {
  //       // console.log('comments DATA', res);
  //       if (res) {
  //         this.commentList = res.data.commmentsList.map((ele: any) => ({
  //           ...ele,
  //           replyCommnetsList: res.data.replyCommnetsList.filter((ele1) => {
  //             return ele.id === ele1.parentCommentId;
  //           }),
  //         }));
  //       }
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //     complete: () => {
  //       this.isCommentsLoader = false;
  //     },
  //   });
  // }

  viewComments(id: number): void {
    // this.isExpand = this.isOpenCommentsPostId == id ? false : true;
    // this.isOpenCommentsPostId = id;
    // if (!this.isExpand) {
    //   this.isOpenCommentsPostId = null;
    // } else {
    //   this.isOpenCommentsPostId = id;
    // }
    // this.spinner.show();
    this.isOpenCommentsPostId = id;
    this.isCommentsLoader = true;
    const data = {
      postId: id,
      profileId: this.profileId,
    };
    this.commonService.post(`${this.commentapiUrl}/comments/`, data).subscribe({
      next: (res) => {
        if (res) {
          // this.spinner.hide();
          // this.commentList = res.data.commmentsList.filter((ele: any) => {
          //   res.data.replyCommnetsList.some((element: any) => {
          //     if (ele?.id === element?.parentCommentId) {
          //       ele?.replyCommnetsList.push(element);
          //       return ele;
          //     }
          //   });
          // });
          this.commentList = res.data.commmentsList.map((ele: any) => ({
            ...ele,
            replyCommnetsList: res.data.replyCommnetsList.filter((ele1) => {
              return ele.id === ele1.parentCommentId;
            }),
          }));
          const replyCount = res.data.replyCommnetsList.filter((ele1) => {
            return ele1.parentCommentId;
          });
        }
      },
      error: (error) => {
        console.log(error);;
      },
      complete: () => {
        this.isCommentsLoader = false;
      },
    });
  }

  // addComment(): void {
  //   if (this.commentData?.parentCommentId) {
  //     this.socketService.commentOnPost(this.commentData, (data) => {
  //       this.toastService.success('replied on comment');
  //       this.postComment = '';
  //       this.commentData = {};

  //       // childPostCommentElement.innerText = '';
  //     });
  //     this.socketService.socket.on('comments-on-post', (data: any) => {
  //       this.isPostComment = false;
  //       this.commentList.map((ele: any) =>
  //         data.filter((ele1) => {
  //           if (ele.id === ele1.parentCommentId) {
  //             ele?.['replyCommnetsList'].push(ele1);
  //             return ele;
  //           }
  //         })
  //       );
  //       this.isReply = false;
  //       this.commentId = null;
  //     });
  //     this.viewComments(this.commentData?.postId);
  //   } else {
  //     this.socketService.commentOnPost(this.commentData, (data) => {
  //       this.toastService.success('comment added on post');
  //       this.commentData.comment = '';
  //       this.commentData = {};
  //       // parentPostCommentElement.innerText = '';
  //     });
  //     this.socketService.socket.on('comments-on-post', (data: any) => {
  //       console.log('commnets data', data);
  //       this.isPostComment = false;
  //       // this.commentList.push(data[0]);
  //       this.commentData.comment = '';
  //       this.commentMessageInputValue = ''
  //       setTimeout(() => {
  //         this.commentMessageInputValue = ''
  //       }, 100);
  //       this.commentData = {};
  //       this.commentData.tags = [];
  //       // parentPostCommentElement.innerText = '';
  //     });
  //     this.viewComments(this.commentData?.postId);

  //   }
  // }

  // addComment(): void {
  //   if (this.commentData) {
  //     this.socketService.commentOnPost(this.commentData, (data) => {
  //       this.postComment = '';
  //       this.commentData = {};
  //       this.commentData.meta = {};
  //       this.commentData.comment = '';
  //       this.commentData.tags = [];
  //       this.commentMessageTags = [];
  //       // childPostCommentElement.innerText = '';
  //     });
  //     this.commentMessageInputValue = '';
  //     setTimeout(() => {
  //       this.commentMessageInputValue = '';
  //     }, 100);
  //     this.commentData = {};
  //     this.viewComments(this.videoDetails?.id);
  //   }
  //   //  else {
  //   //   this.socketService.commentOnPost(this.commentData, (data) => {
  //   //     this.toastService.success('comment added on post');
  //   //     this.commentData.comment = '';
  //   //     this.commentData = {}
  //   //     // parentPostCommentElement.innerText = '';
  //   //     return data;
  //   //   });
  //   // }
  // }

  addComment(): void {
    if (this.commentData) {
      this.socketService.commentOnPost(this.commentData, (data) => {
        this.postComment = '';
        this.commentData = {};
        this.commentData.comment = '';
        this.commentData.tags = [];
        this.commentMessageTags = [];
        // childPostCommentElement.innerText = '';
      });
      this.commentMessageInputValue = '';
      setTimeout(() => {
        this.commentMessageInputValue = '';
      }, 100);
      this.commentData = {};
      this.isReply = false;
      this.viewComments(this.videoDetails?.id);
    }
    //  else {
    //   this.socketService.commentOnPost(this.commentData, (data) => {
    //     this.toastService.success('comment added on post');
    //     this.commentData.comment = '';
    //     this.commentData = {}
    //     // parentPostCommentElement.innerText = '';
    //     return data;
    //   });
    // }
  }

  showReplySection(id) {
    this.isReply = this.commentId == id ? false : true;
    this.commentId = id;
    if (!this.isReply) {
      this.commentId = null;
    }
    this.isReplyComments = false;
  }

  showReplyedComments(id) {
    this.isReplyComments = this.commentId == id ? false : true;
    this.commentId = id;
    if (!this.isReplyComments) {
      this.commentId = null;
    }
    this.isReply = false;
  }

  likeComments(comment) {
    comment.likeCount = comment.likeCount + 1;
    comment.react = 'L';
    const data = {
      postId: comment.postId,
      commentId: comment.id,
      profileId: Number(this.profileId),
      toProfileId: Number(comment.profileId),
      likeCount: comment.likeCount,
      actionType: 'L',
    };
    this.socketService.likeFeedComments(data, (res) => {
      return;
    });
  }

  disLikeComments(comment) {
    comment.likeCount = comment.likeCount - 1;
    comment.react = null;
    const data = {
      postId: comment.postId,
      commentId: comment.id,
      profileId: Number(this.profileId),
      toProfileId: Number(comment.profileId),
      likeCount: comment.likeCount,
    };
    this.socketService.likeFeedComments(data, (res) => {
      return;
    });
  }

  // editComment(comment): void {
  //   if (comment.parentCommentId) {
  //     this.renderer.setProperty(
  //       this.childPostCommentElement?.nativeElement,
  //       'innerHTML',
  //       comment.comment
  //     );
  //     this.commentData['id'] = comment.id
  //     if (comment.imageUrl) {
  //       this.commentData['imageUrl'] = comment.imageUrl
  //       this.isParent = true;
  //     }
  //   } else {
  //     this.renderer.setProperty(
  //       this.parentPostCommentElement?.nativeElement,
  //       'innerHTML',
  //       comment.comment
  //     );
  //     this.commentData['id'] = comment.id
  //     if (comment.imageUrl) {
  //       this.commentData['imageUrl'] = comment.imageUrl
  //       this.isParent = true;
  //     }
  //   }
  //   console.log(comment);
  // }

  editComment(comment): void {
    if (comment.parentCommentId) {
      const modalRef = this.modalService.open(ReplyCommentModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = 'Edit Comment';
      modalRef.componentInstance.confirmButtonLabel = 'Comment';
      modalRef.componentInstance.cancelButtonLabel = 'Cancel';
      modalRef.componentInstance.data = comment;
      modalRef.result.then((res) => {
        if (res) {
          // console.log('resDATA', res);
          this.commentData['tags'] = res?.tags;
          this.commentData.comment = res?.comment;
          this.commentData.postId = res?.postId;
          this.commentData.profileId = res?.profileId;
          this.commentData['id'] = res?.id;
          this.commentData.parentCommentId = res?.parentCommentId;
          this.addComment();
        }
      });
    } else {
      this.isReply = false;
      this.commentMessageInputValue = comment?.comment;
      this.commentData['id'] = comment.id;
      if (comment.imageUrl) {
        this.commentData['imageUrl'] = comment.imageUrl;
        this.isParent = true;
      }
    }
    // console.log(comment);
  }

  deleteComments(comments): void {
    this.commonService
      .delete(`${this.commentapiUrl}/comments/${comments.id}`)
      .subscribe({
        next: (res: any) => {
          this.toastService.success(res.message);
          this.viewComments(comments.postId);
        },
        error: (error) => {
          console.log(error);
          this.toastService.danger(error.message);
        },
      });
  }

  getSearchData1(): void {
    this.commonService
      .get(`${this.searchApi}?searchText=${this.searchText}`)
      .subscribe({
        next: (res: any) => {
          if (res?.data?.length > 0) {
            this.userSearchList = res.data;
            console.log(' this.userList', this.userSearchList);

            this.userSearchNgbDropdown.open();
          } else {
            this.userSearchList = [];
            this.userSearchNgbDropdown.close();
          }
        },
        error: (error) => {
          this.userSearchList = [];
          this.userSearchNgbDropdown.close();
          console.log(error);
        },
      });
  }

  getSearchData() {
    const search = this.searchText;
    this.commonService.post(`${this.apiUrl}/search-all`, { search }).subscribe({
      next: (res: any) => {
        if (res) {
          this.userSearchList = res.channels;
          this.userSearchNgbDropdown.open();
          console.log(res);
        } else {
          this.userSearchList = [];
          this.userSearchNgbDropdown.close();
        }
      },
      error: (error) => {
        this.userSearchList = [];
        this.userSearchNgbDropdown.close();
        console.log(error);
      },
    });
  }

  openProfile(Id): void {
    const url = `https://translate.tube/channel/${Id}`;
    window.open(url, '_blank');
  }

  onTagUserInputChangeEvent(data: any): void {
    this.commentData.comment = data?.html;
    this.commentData.meta = data?.meta;
    this.commentMessageTags = data?.tags;
    console.log(this.commentData, data);
  }

  socketListner(): void {
    this.socketService.socket.on('likeOrDislikeComments', (res) => {
      console.log('likeOrDislikeComments', res);
      if (res[0]) {
        if (res[0].parentCommentId) {
          // let index = this.commentList.findIndex(obj => obj.id === res[0].parentCommentId);
          // let index1 = this.commentList.findIndex(obj => obj.replyCommnetsList.findIndex(ele => ele.id === res[0].id));
          // if (index1 !== -1 && index !== -1) {
          //   this.commentList[index].replyCommnetsList[index1].likeCount = res[0]?.likeCount;
          // }
          this.commentList.map((ele: any) =>
            res.filter((ele1) => {
              if (ele.id === ele1.parentCommentId) {
                let index = ele?.['replyCommnetsList'].findIndex(
                  (obj) => obj.id === res[0].id
                );
                if (index !== -1) {
                  return (ele['replyCommnetsList'][index].likeCount =
                    res[0]?.likeCount);
                } else {
                  return ele;
                }
              }
            })
          );
        } else {
          let index = this.commentList.findIndex((obj) => obj.id === res[0].id);
          if (index !== -1) {
            this.commentList[index].likeCount = res[0].likeCount;
          }
        }
        // if (this.post.id === res[0]?.id) {
        //   this.post.likescount = res[0]?.likescount;
        // }
      }
    });

    this.socketService.socket.on('comments-on-post', (data: any) => {
      this.isPostComment = false;
      console.log('comments-on-post', data[0]);
      if (data[0]?.parentCommentId) {
        this.commentList.map((ele: any) =>
          data.filter((ele1) => {
            if (ele.id === ele1.parentCommentId) {
              let index = ele?.['replyCommnetsList'].findIndex(
                (obj) => obj.id === data[0].id
              );
              if (!ele?.['replyCommnetsList'][index]) {
                ele?.['replyCommnetsList'].push(ele1);
                return ele;
              } else {
                return ele;
              }
            }
          })
        );
      } else {
        let index = this.commentList.findIndex((obj) => obj.id === data[0].id);
        if (!this.commentList[index]) {
          this.commentList.push(data[0]);
        }
        // this.viewComments(data[0]?.postId);
      }
    });
  }

  stripTags(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.innerText;
  }
}
