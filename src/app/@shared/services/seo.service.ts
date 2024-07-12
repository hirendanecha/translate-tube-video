import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Inject, Injectable, Injector, isDevMode, PLATFORM_ID } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  destroyed = new Subject<void>();

  constructor(
    private title: Title,
    private meta: Meta,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  updateTitle(title: string): void {
    this.title.setTitle(title);
  }

  updateMetaTags(metaTags: MetaDefinition[]): void {
    metaTags.forEach((m) => {
      this.meta.updateTag(m);
    });

    if (isDevMode()) {
      const metaTag: MetaDefinition = {
        name: 'googlebot',
        content: 'noindex, nofollow'
      };
      this.meta.updateTag(metaTag);
    }
  }

  updateComponentSeo(seoObj: any = {}, isMainPage: boolean = false): void {
    const metaTags = [...seoObj?.metaTags] || [];
    const tagValue = {
      title: seoObj?.title,
      url: seoObj?.url,
      description: metaTags?.[0]?.content,
      image: metaTags?.[1]?.content
    };

    this.updateTitle(seoObj?.title);
    this.updateMetaTags(metaTags);

    this.updateFbSeo(tagValue);

    this.createAlternateLink(seoObj?.url);

    if (isMainPage === false) {
      this.createCanonicalLink(seoObj?.url);
    }
  }

  // eslint-disable-next-line max-len
  updateFbSeo(tags: { title: string, url?: string, appId?: string, description?: string, image?: string }): void {
    const tagValue = { ...tags };

    if (!tagValue.url) {
      if (isPlatformServer(this.platformId)) {
        tagValue.url = this.injector.get('REQ_URL').toLowerCase();
      } else {
        tagValue.url = this.document.URL.toLowerCase() || this.document.location.href.toLowerCase();
      }
    }

    if (!tagValue.image) {
      tagValue.image = 'https://www.translate.tube/assets/images/profile-cover.png';
    }

    this.meta.updateTag({
      property: 'og:type',
      content: 'website'
    });

    if (tagValue.title) {
      this.meta.updateTag({
        property: 'og:title',
        content: tagValue.title
      });
    }

    if (tagValue.description) {
      this.meta.updateTag({
        property: 'og:description',
        content: tagValue.description
      });
    }

    if (tagValue.image) {
      this.meta.updateTag({
        property: 'og:image',
        content: tagValue.image
      });
    }

    this.meta.updateTag({
      property: 'og:url',
      content: tagValue.url
    });

    this.meta.updateTag({
      property: 'og:appId',
      content: tagValue.appId
    });

    this.meta.updateTag({
      property: 'fb:app_id',
      content: tagValue.appId
    });

    this.meta.updateTag({
      property: 'fb:app:id',
      content: tagValue.appId
    });

  }

  private createAlternateLink(url: string = '') {
    const canURL = url || this.document.URL;
    const link = this.document.createElement('link');

    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', 'en');
    link.setAttribute('href', canURL || '[url]');
    this.document.head.appendChild(link);
  }

  private createCanonicalLink(url: string = '') {
    const canURL = url || this.document.URL;
    const link = this.document.createElement('link');

    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canURL || '[url]');
    this.document.head.appendChild(link);
  }

  updateSeoMetaData(obj: any = {}, isMainPage: boolean = false): void {
    const seoObj = {
      url: obj?.url,
      title: obj?.title,
      metaTags: [{
        name: 'description',
        content: obj?.description
      }, {
        name: 'image',
        content: obj?.image
      }, {
        name: 'video',
        content: obj?.video
      },
      ]
    };
    console.log('seoObj', seoObj, obj?.description)
    this.updateComponentSeo(seoObj, isMainPage);
  }
}
