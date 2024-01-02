import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-modal',
  templateUrl: './toast-modal.component.html',
  styleUrls: ['./toast-modal.component.scss'],
  host: {'[class.ngb-toasts]': 'true'}
})
export class ToastModalComponent implements OnInit {

  constructor(public toastService: ToastService) {}

  ngOnInit() {
  }

  isTemplate(toast: { textOrTpl: any; }) { return toast.textOrTpl instanceof TemplateRef; }
}
