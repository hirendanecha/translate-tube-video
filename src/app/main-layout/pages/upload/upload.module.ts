import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/@shared/shared.module';
import { UploadRoutingModule } from './upload-routing.module';
import { UploadVideoComponent } from './upload-video/upload-video.component';
import { UploadComponent } from './upload.component';



@NgModule({
  declarations: [
    UploadComponent,
    UploadVideoComponent
  ],
  imports: [
    UploadRoutingModule,
    SharedModule,
  ]
})
export class UploadModule { }
