import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reply-comment-modal',
  templateUrl: './reply-comment-modal.component.html',
  styleUrls: ['./reply-comment-modal.component.scss'],
})
export class ReplyCommentModalComponent implements AfterViewInit {
  @Input() cancelButtonLabel: string = 'Cancel';
  @Input() confirmButtonLabel: string = 'Confirm';
  @Input() title: string = 'Confirmation Dialog';
  @Input() message: string;
  @Input() data: any;
  commentData: any = {
    file: null,
    url: '',
    tags: []
  };

  commentMessageInputValue: string = ''
  commentMessageTags: any[];

  constructor(public activeModal: NgbActiveModal,
    private toastService: ToastService,) {
  }

  ngAfterViewInit(): void {
    if (this.data) {
      this.commentMessageInputValue = this.data?.comment
      this.commentData.id = this.data.id
      this.commentData.parentCommentId = this.data.parentCommentId
      this.commentData.postId = this.data.postId
      this.commentData.profileId = this.data.profileId
      this.commentData['imageUrl'] = this.data?.imageUrl
    }
  }

  onPostFileSelect(event: any): void {
    const file = event.target?.files?.[0] || {};
    if (file?.size < 5120000) {
      if (file.type.includes('image/')) {
        this.commentData['file'] = file;
        this.commentData['imageUrl'] = URL.createObjectURL(file);
      } else {
        this.toastService.danger(`sorry ${file.type} are not allowed!`)
      }
    } else {
      this.toastService.warring('Image is too large!');
    }
  }

  removePostSelectedFile(): void {
    this.commentData['file'] = null;
    this.commentData['imageUrl'] = '';
  }

  onTagUserInputChangeEvent(data: any): void {
    console.log('comments-data', data)
    this.commentData.comment = data?.html;
    this.commentMessageTags = data?.tags;
  }
}
