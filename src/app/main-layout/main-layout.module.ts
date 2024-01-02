import { NgModule } from '@angular/core';

import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { MainLayoutComponent } from './main-layout.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UploadVideoComponent } from './pages/upload/upload-video/upload-video.component';
import { SharedModule } from '../@shared/shared.module';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { HistoryPageComponent } from './pages/history-page/history-page.component';
import { UploadComponent } from './pages/upload/upload.component';
import { EditProfileComponent } from './pages/settings/edit-profile/edit-profile.component';
import { MyAccountComponent } from './pages/settings/my-account/my-account.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NotificationsModalComponent } from './components/notifications-modal/notifications-modal.component';


@NgModule({
  declarations: [
    MainLayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    MobileMenuComponent,
    HistoryPageComponent,
    EditProfileComponent,
    MyAccountComponent,
    NotificationsModalComponent
  ],
  imports: [
    MainLayoutRoutingModule,
    SharedModule,
    LazyLoadImageModule
  ]
})
export class MainLayoutModule { }
