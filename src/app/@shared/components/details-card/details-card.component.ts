import { Component } from '@angular/core';

@Component({
  selector: 'app-details-card',
  templateUrl: './details-card.component.html',
  styleUrls: ['./details-card.component.scss']
})
export class DetailsCardComponent {

  cardsData = [
    {
      backgroundColor: 'primary',
      icon: 'fas fa-fw fa-users',
      count: 26,
      label: 'Channels'
    },
    {
      backgroundColor: 'warning',
      icon: 'fas fa-fw fa-video',
      count: 156,
      label: 'Videos'
    },
    {
      backgroundColor: 'success',
      icon: 'fas fa-fw fa-list-alt',
      count: 123,
      label: 'Categories'
    },
    {
      backgroundColor: 'danger',
      icon: 'fas fa-fw fa-cloud-upload-alt',
      count: 13,
      label: 'New Videos'
    }
  ];
}
