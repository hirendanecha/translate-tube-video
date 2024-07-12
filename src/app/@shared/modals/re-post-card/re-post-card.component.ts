import {
  AfterViewInit,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { environment } from 'src/environments/environment';

declare var jwplayer: any;
@Component({
  selector: 'app-re-post-card',
  templateUrl: './re-post-card.component.html',
  styleUrls: ['./re-post-card.component.scss'],
})
export class RePostCardComponent implements AfterViewInit, OnInit {
  @Input() post: any = [];

  descriptionimageUrl: string;

  tubeUrl = environment.frontendUrl;

  sharedPost: string;
  player: any;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  redirectToParentProfile(post) {
    if (this.post.streamname) {
      this.sharedPost = this.tubeUrl + 'video/' + post.id;
    }
    const url = this.sharedPost;
    window.open(url, '_blank');
  }
}
