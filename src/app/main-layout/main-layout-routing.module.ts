import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { UploadVideoComponent } from './pages/upload/upload-video/upload-video.component';
import { HistoryPageComponent } from './pages/history-page/history-page.component';
import { UserAuthGuard } from '../@shared/guards/user-auth.guard';
import { UploadComponent } from './pages/upload/upload.component';
import { EditProfileComponent } from './pages/settings/edit-profile/edit-profile.component';
import { MyAccountComponent } from './pages/settings/my-account/my-account.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
        // canActivate: mapToCanActivate([UserAuthGuard]),
      },
      {
        path: 'channels',
        loadChildren: () => import('./pages/channels/channels.module').then((m) => m.ChannelModule),
        canActivate: mapToCanActivate([UserAuthGuard]),

      },
      {
        path: 'video/:id',
        loadChildren: () => import('./pages/video/video.module').then((m) => m.VideoModule),
        // canActivate: mapToCanActivate([UserAuthGuard]),
      },
      {
        path: 'upload',
        loadChildren: () => import('./pages/upload/upload.module').then((m) => m.UploadModule),
        canActivate: mapToCanActivate([UserAuthGuard]),
      },
      {
        path: 'notifications',
        loadChildren: () => import('./pages/notifications/notification.module').then((m) => m.NotificationsModule),
        data: {
          isShowLeftSideBar: true
        },
        canActivate: mapToCanActivate([UserAuthGuard]),
      },
      {
        path: 'history-page',
        component: HistoryPageComponent,
        canActivate: mapToCanActivate([UserAuthGuard]),
      },
      {
        path: 'settings',
        component: EditProfileComponent,
        canActivate: mapToCanActivate([UserAuthGuard]),
      },
      {
        path: 'account',
        component: MyAccountComponent,
        canActivate: mapToCanActivate([UserAuthGuard]),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule { }
