import { AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appBtnLoader]'
})
export class BtnLoaderDirective implements AfterViewInit, OnChanges {

  @Input('appBtnLoader') appBtnLoader: boolean = false;
  loaderDivClasses!: DOMTokenList;

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit(): void {
    const parentElement = this.el.nativeElement;
    const loaderDiv = document.createElement('div');

    this.loaderDivClasses = loaderDiv.classList;
    this.loaderDivClasses.add('spinner-border', 'spinner-border-sm', 'text-light', 'ms-3', 'd-none');
    parentElement.appendChild(loaderDiv);
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes?.['appBtnLoader']){
      if (this.loaderDivClasses) {
        this.appBtnLoader === true ? this.loaderDivClasses.remove('d-none') : this.loaderDivClasses.add('d-none')
      }
    }
  }
}
