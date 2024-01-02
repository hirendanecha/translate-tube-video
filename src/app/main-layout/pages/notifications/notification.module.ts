import { NgModule } from '@angular/core';

import { NotificationsRoutingModule } from './notification-routing.module';
import { SharedModule } from 'src/app/@shared/shared.module';
import { NotificationsComponent } from './notification.component';

@NgModule({
  declarations: [NotificationsComponent],
  imports: [SharedModule, NotificationsRoutingModule],
})
export class NotificationsModule {}
