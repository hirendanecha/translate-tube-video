import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../services/toast.service';
import { ChannelService } from '../../services/channels.service';
import { AuthService } from '../../services/auth.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-conference-link-modal',
  templateUrl: './conference-link-modal.component.html',
  styleUrls: ['./conference-link-modal.component.scss'],
})
export class ConferenceLinkComponent {
  userForm = new FormGroup({
    profileid: new FormControl(),
    feature: new FormControl(false),
    firstname: new FormControl(''),
    unique_link: new FormControl({ value: '', disabled: true }),
    profile_pic_name: new FormControl(''),
  });
  profilePic = '';
  profileImg: any = {
    file: null,
    url: '',
  };
  selectedFile: any;
  myProp: string;
  hasDisplayedError = false;
  profileId: number;
  originUrl = environment.conferenceUrl
  link: string = '';
  constructor(
    private spinner: NgxSpinnerService,
    public toastService: ToastService,
    public activateModal: NgbActiveModal,
    private channelService: ChannelService,
    public authService: AuthService,
  ) {
    this.profileId = JSON.parse(this.authService.getUserData() as any).Id;
  }

  ngOnInit(): void { }

  slugify = (str: string) => {
    return str?.length > 0
      ? str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
      : '';
  };


  openConferenceCall(): void {
    const webRtcUrl = `${this.originUrl}${this.link}`;
    window.open(webRtcUrl, '_blank');
    this.activateModal.close();
  }

}
