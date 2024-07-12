import { AfterViewInit, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-share-post-modal',
  templateUrl: './share-post-modal.component.html',
  styleUrls: ['./share-post-modal.component.scss'],
})
export class SharePostModalComponent implements AfterViewInit {
  @Input() cancelButtonLabel: string | undefined = 'Cancel';
  @Input() confirmButtonLabel: string | undefined = 'Confirm';
  @Input() title: string | undefined = 'Confirmation Dialog';
  @Input() message: string | undefined;
  @Input() post: any = [];

  tubeUrl = environment.frontendUrl;
  sharePost: any;
  metaData: any;

  postMessageInputValue: string = '';

  sharePostData: any = {
    profileid: '',
    postdescription: '',
    meta: {},
    tags: [],
    parentPostId: null
  };

  constructor(
    public activeModal: NgbActiveModal,
    public authService: AuthService
  ) {}

  ngAfterViewInit(): void {
    const profileId  = JSON.parse(this.authService.getUserData() as any)?.profileId;
    this.sharePostData.profileid = profileId;
    this.sharePostData.parentPostId = this.post.id;
    this.sharePost = this.tubeUrl + 'video/' + this.post.id; 
  }

  onTagUserInputChangeEvent(data: any): void {
    this.sharePostData.postdescription = data?.html;
    this.sharePostData.tags = data?.tags;
  }

  clearMetaData(): void {
    this.metaData = {};
  }

  submit() {
    this.activeModal.close(this.sharePostData);
    this.clearMetaData()
  }
}
