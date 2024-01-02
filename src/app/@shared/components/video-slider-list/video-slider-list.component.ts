import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-video-slider-list',
  templateUrl: './video-slider-list.component.html',
  styleUrls: ['./video-slider-list.component.scss'],
})
export class VideoSliderListComponent implements OnInit {
  // @Input() imageUrl!: string;
  // @Input() videoTime!: string;
  // @Input() videoTitle!: string;
  // @Input() views!: string;
  @Input() videoList: any;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  openDetailPage(video: any): void {
    console.log(video.id);
    this.router.navigate([`video/${video.id}`], {
      state: { data: video },
    });
  }

  stripTags(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.innerText;
  }
}
