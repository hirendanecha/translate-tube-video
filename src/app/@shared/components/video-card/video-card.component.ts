import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VideoPostModalComponent } from '../../modals/video-post-modal/video-post-modal.component';
import { AuthService } from '../../services/auth.service';
declare var Clappr: any;
declare var jwplayer: any;

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.scss'],
})
export class VideoCardComponent implements OnInit, AfterViewInit {
  isPlay = false;
  postId!: number | null;
  profileid: number;

  @Input('videoData') videoData: any = [];
  constructor(
    private router: Router,
    public modalService: NgbModal,
    public authService: AuthService
  ) {
    this.profileid = JSON.parse(this.authService.getUserData() as any)?.Id;
    // console.log(this.profileid);
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  ngAfterViewInit(): void {}

  playvideo(video: any): void {
    this.isPlay = false;
    const player = jwplayer('jwVideo-' + video.id);
    player.setup({
      file: video.streamname,
      image: video?.thumbfilename,
      mute: true,
      autostart: false,
      volume: 90,
      height: '220px',
      width: '390px',
      playbackRateControls: false,
      preload: 'metadata',
    });
    player.load();
    this.playVideoByID(video.id);
  }

  openDetailPage(video: any): void {
    // this.router.navigate([`video/${video.id}`], {
    //   state: { data: video },
    // });
    const url = `video/${video.id}`;
    window.open(url, '_blank');
  }

  playVideoByID(id: number) {
    this.postId = this.isPlay ? null : id;
    this.isPlay = !this.isPlay;
    console.log('isPlay', this.isPlay);
    // console.log('postId', this.postId);
  }

  stripTags(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.innerText;
  }

  videoEdit(video: any): void {
    // console.log(video);

    const modalRef = this.modalService.open(VideoPostModalComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.title = `Edit Video Details`;
    modalRef.componentInstance.data = { ...video };
    modalRef.componentInstance.confirmButtonLabel = 'Save';
    modalRef.componentInstance.cancelButtonLabel = 'Cancel';
    modalRef.result.then((res) => {
      // console.log(res);
      window.location.reload();
      if (res === 'success') {
      }
    });
  }
}
