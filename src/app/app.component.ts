import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { ShareService } from './@shared/services/share.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  isShowScrollTopBtn: boolean = false;

  constructor(
    public shareService: ShareService,
    private spinner: NgxSpinnerService,
  ) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > 100) {
      this.isShowScrollTopBtn = true;
    } else {
      this.isShowScrollTopBtn = false;
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.spinner.hide();
    setTimeout(() => {
      const splashScreenLoader = document.getElementById('splashScreenLoader');
      if (splashScreenLoader) {
        splashScreenLoader.style.display = 'none';
      }
    }, 1000);
  }
}
