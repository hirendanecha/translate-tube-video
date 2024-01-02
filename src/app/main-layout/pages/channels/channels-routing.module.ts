import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChannelsComponent } from '../channels/channels.component';
import { SingleChannelComponent } from '../channels/single-channel/single-channel.component';

const routes: Routes = [
  {
    path: '',
    component: ChannelsComponent
  },
  {
    path: ':id',
    component: SingleChannelComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChannelRoutingModule { }
