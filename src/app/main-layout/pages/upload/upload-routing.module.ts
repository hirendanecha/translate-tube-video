import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadComponent } from './upload.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';

const routes: Routes = [
  { path: '', component: UploadComponent },
  { path: 'details', component: UploadVideoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadRoutingModule {}
