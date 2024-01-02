import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { BtnLoaderDirective } from './directives/btn-loader.directive';
import { NgbActiveOffcanvas, NgbDropdownModule, NgbModal, NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from './modals/confirmation-modal/confirmation-modal.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faAngleDoubleUp, faXmark, faBars, faChevronDown, faChevronUp, faChevronRight, faUser, faUsers, faBell, faHouse, faGear, faSun, faMoon, faPlus, faVideo, faCloudUpload, faHistory, faCalendar, faPlayCircle, faUpload, faPlusSquare, faSearch, faPlusCircle, faUserCircle, faCog, faCheckCircle, faSignOutAlt, faEye, faClock, faFileUpload, faAngleRight, faCloudUploadAlt, faListAlt, faThumbsDown, faThumbsUp, faMessage, faImage, faPaperPlane, faUserXmark, faArrowRight, faEllipsis, faPlay, faBookOpen, faPenToSquare, faTrash, faTrashCan, faRotateRight, faShareAlt, faCaretDown, faFolderOpen, faCopy, faSquareCheck, faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { HttpClientModule } from '@angular/common/http';
import { VideoCardComponent } from './components/video-card/video-card.component'
import { LfDashboardComponent } from './components/lf-dashboard/lf-dashboard.component';
import { ChannelsCardComponent } from './components/channels-card/channels-card.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { PipeModule } from './pipe/pipe.module';
import { VideoSliderListComponent } from './components/video-slider-list/video-slider-list.component';
import { DetailsCardComponent } from './components/details-card/details-card.component';
import { TagUserInputComponent } from './components/tag-user-input/tag-user-input.component';
import { ReplyCommentModalComponent } from './components/reply-comment-modal/reply-comment-modal.component';
import { LAZYLOAD_IMAGE_HOOKS, ScrollHooks } from 'ng-lazyload-image';
import { VideoPostModalComponent } from './modals/video-post-modal/video-post-modal.component';
import { CreateChannelComponent } from './modals/create-channel/create-channel-modal.component';
import { ConferenceLinkComponent } from './modals/create-conference-link/conference-link-modal.component';
import { CopyClipboardDirective } from './directives/copy-clipboard.directive';
import { PostMetaDataCardComponent } from './components/post-meta-data-card/post-meta-data-card.component';
import { MentionModule } from 'angular-mentions';

const sharedComponents = [
  ConfirmationModalComponent,
  BtnLoaderDirective,
  VideoCardComponent,
  LfDashboardComponent,
  ChannelsCardComponent,
  VideoSliderListComponent,
  DetailsCardComponent,
  TagUserInputComponent,
  ReplyCommentModalComponent,
  VideoPostModalComponent,
  CreateChannelComponent,
  ConferenceLinkComponent,
  CopyClipboardDirective,
  PostMetaDataCardComponent
];

const sharedModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  NgxTrimDirectiveModule,
  NgbToastModule,
  NgbDropdownModule,
  FontAwesomeModule,
  NgxSpinnerModule,
  RouterModule,
  NgbModule,
  PipeModule,
  NgbModule,
  MentionModule
];

@NgModule({
  declarations: sharedComponents,
  imports: sharedModules,
  exports: [...sharedModules, ...sharedComponents],
  providers: [
    NgbActiveOffcanvas,
    { provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks },
  ],
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faAngleDoubleUp,
      faXmark,
      faBars,
      faChevronDown,
      faChevronUp,
      faChevronRight,
      faUser,
      faUsers,
      faBell,
      faHouse,
      faGear,
      faSun,
      faMoon,
      faPlus,
      faVideo,
      faCloudUpload,
      faHistory,
      faCalendar,
      faPlayCircle,
      faUpload,
      faPlusSquare,
      faSearch,
      faPlusCircle,
      faUserCircle,
      faCog,
      faCheckCircle,
      faSignOutAlt,
      faEye,
      faClock,
      faFileUpload,
      faAngleRight,
      faCloudUploadAlt,
      faListAlt,
      faThumbsDown,
      faThumbsUp,
      faMessage,
      faImage,
      faPaperPlane,
      faArrowRight,
      faEllipsis,
      faUserXmark,
      faPlay,
      faBookOpen,
      faPenToSquare,
      faTrashCan,
      faRotateRight,
      faShareAlt,
      faCaretDown,
      faPlus,
      faFolderOpen,
      faCopy,
      faSquareCheck,
      faSquareXmark
    );
  }
}
