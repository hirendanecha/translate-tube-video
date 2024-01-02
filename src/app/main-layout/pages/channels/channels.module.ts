import { NgModule } from '@angular/core';

import { ChannelRoutingModule } from './channels-routing.module';
import { SharedModule } from 'src/app/@shared/shared.module';
import { SingleChannelComponent } from './single-channel/single-channel.component';
import { ChannelsComponent } from './channels.component';


@NgModule({
  declarations: [
    ChannelsComponent,
    SingleChannelComponent,
  ],
  imports: [
    ChannelRoutingModule,
    SharedModule,
  ]
})
export class ChannelModule { }
