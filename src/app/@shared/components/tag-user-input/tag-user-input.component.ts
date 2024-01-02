import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-tag-user-input',
  templateUrl: './tag-user-input.component.html',
  styleUrls: ['./tag-user-input.component.scss']
})
export class TagUserInputComponent implements OnChanges, OnDestroy {

  @Input('value') value: string = '';
  @Input('placeholder') placeholder: string = 'ss';
  @Input('isShowMetaPreview') isShowMetaPreview: boolean = true;
  @Input('isAllowTagUser') isAllowTagUser: boolean = true;
  @Output('onDataChange') onDataChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('tagInputDiv', { static: false }) tagInputDiv: ElementRef;
  @ViewChild('userSearchDropdownRef', { static: false, read: NgbDropdown }) userSearchNgbDropdown: NgbDropdown;

  ngUnsubscribe: Subject<void> = new Subject<void>();
  metaDataSubject: Subject<void> = new Subject<void>();

  userList: any = [];
  userNameSearch = '';
  metaData: any = {};
  apiUrl = environment.apiUrl + 'customers/'
  constructor(
    private renderer: Renderer2,
    private spinner: NgxSpinnerService,
    private commonService: CommonService
  ) {
    this.metaDataSubject.pipe(debounceTime(300)).subscribe(() => {
      this.getMetaDataFromUrlStr();
      this.checkUserTagFlag();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const val = changes?.['value']?.currentValue;
    this.setTagInputDivValue(val);

    if (val === '') {
      this.clearUserSearchData();
      this.clearMetaData();
    } else {
      this.getMetaDataFromUrlStr();
      this.checkUserTagFlag();
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.metaDataSubject.next();
    this.metaDataSubject.complete();
  }

  messageOnKeyEvent(): void {
    this.metaDataSubject.next();
    this.emitChangeEvent();
  }

  checkUserTagFlag(): void {
    if (this.isAllowTagUser) {
      const htmlText = this.tagInputDiv?.nativeElement?.innerHTML || '';

      const atSymbolIndex = htmlText.lastIndexOf('@');

      if (atSymbolIndex !== -1) {
        this.userNameSearch = htmlText.substring(atSymbolIndex + 1);
        if (this.userNameSearch?.length > 2) {
          this.getUserList(this.userNameSearch);
        } else {
          this.clearUserSearchData();
        }
      } else {
        this.clearUserSearchData();
      }
    }
  }

  getMetaDataFromUrlStr(): void {
    const htmlText = this.tagInputDiv?.nativeElement?.innerHTML || '';
    const text = htmlText.replace(/<[^>]*>/g, '');
    // const matches = htmlText.match(/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/gi);
    const matches = text.match(/(?:https?:\/\/|www\.)[^\s]+/g);
    const url = matches?.[0];
    if (url) {
      if (!url?.includes(this.metaData?.url)) {
        this.spinner.show();
        this.ngUnsubscribe.next();

        this.commonService
          .getMetaData({ url })
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe({
            next: (res: any) => {
              if (res?.meta?.image) {
                const urls = res.meta?.image?.url;
                const imgUrl = Array.isArray(urls) ? urls?.[0] : urls;

                this.metaData = {
                  title: res?.meta?.title,
                  metadescription: res?.meta?.description,
                  metaimage: imgUrl,
                  metalink: res?.meta?.url || url,
                  url: url,
                };

                this.emitChangeEvent();
              }

              this.spinner.hide();
            },
            error: () => {
              this.clearMetaData();
              this.spinner.hide();
            },
          });
      }
    } else {
      this.clearMetaData();
    }
  }

  moveCursorToEnd(): void {
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(this.tagInputDiv?.nativeElement, this.tagInputDiv?.nativeElement.childNodes.length);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  selectTagUser(user: any): void {
    const htmlText = this.tagInputDiv?.nativeElement?.innerHTML || '';

    const text = htmlText.replace(
      `@${this.userNameSearch}`,
      `<a href="/settings/view-profile/${user?.Id}" class="text-danger" data-id="${user?.Id}">@${user?.Username}</a>`
    );
    this.setTagInputDivValue(text);
    this.emitChangeEvent();
    this.moveCursorToEnd()
  }

  getUserList(search: string): void {
    this.commonService.get(`${this.apiUrl}search-user?searchText=${search}`).subscribe({
      next: (res: any) => {
        if (res?.data?.length > 0) {
          this.userList = res.data;
          this.userSearchNgbDropdown?.open();
        } else {
          this.clearUserSearchData();
        }
      },
      error: () => {
        this.clearUserSearchData();
      },
    });
  }

  clearUserSearchData(): void {
    this.userNameSearch = '';
    this.userList = [];
    this.userSearchNgbDropdown?.close();
  }

  clearMetaData(): void {
    this.metaData = {};
    this.emitChangeEvent();
  }

  setTagInputDivValue(htmlText: string): void {
    if (this.tagInputDiv) {
      this.renderer.setProperty(
        this.tagInputDiv.nativeElement,
        'innerHTML',
        htmlText
      );
    }
  }

  emitChangeEvent(): void {
    if (this.tagInputDiv) {
      // console.log(this.tagInputDiv);
      const htmlText = this.tagInputDiv?.nativeElement?.innerHTML;
      this.value = `${htmlText}`.replace(/\<div\>\<br\>\<\/div\>/ig, '');

      this.onDataChange.emit({
        html: htmlText,
        tags: this.tagInputDiv?.nativeElement?.children,
        meta: this.metaData,
      });
    }
  }
}
