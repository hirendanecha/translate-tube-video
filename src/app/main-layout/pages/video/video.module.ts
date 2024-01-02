import { NgModule } from '@angular/core';

import { VideoRoutingModule } from './video-routing.module';
import { SharedModule } from 'src/app/@shared/shared.module';
import { VideoComponent } from './video.component';


@NgModule({
  declarations: [
    VideoComponent,
  ],
  imports: [
    VideoRoutingModule,
    SharedModule,
  ]
})
export class VideoModule { }
