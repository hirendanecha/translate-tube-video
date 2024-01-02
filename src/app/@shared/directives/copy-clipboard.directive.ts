import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Directive({
  selector: '[appCopyClipboard]'
})
export class CopyClipboardDirective {

  @Input("appCopyClipboard")
  public payload: string;

  constructor(
    private toastService: ToastService,
  ) {}

  @HostListener("click", ["$event"])
  public onClick(event: MouseEvent): void {

    event.preventDefault();
    if (!this.payload)
      return;

    let listener = (e: ClipboardEvent) => {
      let clipboard = e.clipboardData || window["clipboardData"];
      clipboard.setData("text", this.payload.toString());
      e.preventDefault();

      this.toastService.success('Link has been copied to clipboard');
    };

    document.addEventListener("copy", listener, false)
    document.execCommand("copy");
    document.removeEventListener("copy", listener, false);
  }
}
