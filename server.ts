import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppServerModule } from './src/main.server';
import 'localstorage-polyfill';
import 'reflect-metadata';
import fetch from 'node-fetch';
import { environment } from 'src/environments/environment.prod';

const api_url = environment.apiUrl;


// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'tube-dist/video-translate-tube/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';
  const domino = require('domino-ext');
  const fs = require('fs');
  const path = require('path');
  const template = fs
    .readFileSync(
      path.join(join(process.cwd(), 'tube-dist/video-translate-tube/browser'), 'index.html')
    )
    .toString();
  // Shim for the global window and document objects.
  const window = domino.createWindow(template);
  global['localStorage'] = localStorage;
  global['window'] = window;
  global['document'] = window.document;
  global['self'] = window;
  global['sessionStorage'] = window.sessionStorage;
  global['IDBIndex'] = window.IDBIndex;
  global['navigator'] = window.navigator;
  global['Event'] = window.Event;
  global['Event']['prototype'] = window.Event.prototype;
  global['HTMLElement'] = window.HTMLElement;
  global['jwplayer'] = window.jwplayer;
  // global.google = google;
  global['getComputedStyle'] = window.getComputedStyle;

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
      inlineCriticalCss: false
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(
      indexHtml,
      { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] },
      async (err, html) => {
        if (err) {
          console.log('Error', err);
        }
        const params = req.params[0];
        var seo: any = {
          title: 'TranslateTube',
          description:
            'The Umbrella platform for All freedom based projects worldwide',
          image:
            'https://video.translate.tube/assets/banner/translate-Tube-Logo.jpg',
          site: 'https://video.translate.tube/',
          url: 'https://video.translate.tube' + params,
          keywords: 'TranslateTube',
        };
        if (
          params.indexOf('channel/') > -1
        ) {
          let id = params.split('/');
          id = id[id.length - 1];
          // id = params[params.length - 1];
          // id = Number(id);
          // let id = 'local-organic-food-sources';
          console.log({ id });

          // if (!isNaN(id) || Math.sign(id) > 0) {
          const channel: any = await getChannel(id);

          console.log({ params }, { id }, channel.data[0]);

          const talent = {
            name: channel.data[0]?.firstname,
            description: channel.data[0]?.unique_link,
            image: channel.data[0]?.profile_pic_name,
          };
          seo.title = talent.name;
          seo.description = strip_html_tags(talent.description);
          seo.image = `${talent.image}`;
          // }
        } else if (params.indexOf('video/') > -1) {
          let id = params.split('/');
          id = id[id.length - 1];
          // id = params[params.length - 1];
          // id = Number(id);
          // let id = 'local-organic-food-sources';
          console.log({ id });

          // if (!isNaN(id) || Math.sign(id) > 0) {
          const [post]: any = await getPost(+id);

          console.log(post);
          const pdhtml = document.createElement('div');
          pdhtml.innerHTML = post?.postdescription || post?.metadescription;
          const talent = {
            name: post?.title || post?.albumname || 'translate.Tube Post',
            description: pdhtml?.textContent || 'Post content',
            image: post?.thumbfilename || post?.metaimage || post?.imageUrl,
          };
          seo.title = talent.name;
          seo.description = strip_html_tags(talent.description);
          seo.image = talent.image;
          // }
        }

        html = html.replace(/\$TITLE/g, seo.title);
        html = html.replace(/\$DESCRIPTION/g, strip_html_tags(seo.description));
        html = html.replace(
          /\$OG_DESCRIPTION/g,
          strip_html_tags(seo.description)
        );
        html = html.replace(
          /\$OG_META_DESCRIPTION/g,
          strip_html_tags(seo.description)
        );
        html = html.replace(/\$OG_TITLE/g, seo.title);
        html = html.replace(/\$OG_IMAGE/g, seo.image);
        html = html.replace(/\$OG_SITE/g, seo.site);
        html = html.replace(/\$OG_URL/g, seo.url);
        html = html.replace(/\$OG_META_KEYWORDS/g, seo.keywords);
        res.send(html);
      }
    );
  });
  return server;
}

async function getChannel(id: any) {
  return fetch(api_url + 'channels/' + id).then((resp) =>
    resp.json()
  ).catch(err => {
    console.log("getChannel: ", err);

  });
}

async function getPost(id: any) {
  console.log(api_url);
  return fetch(api_url + 'posts/get/' + id).then((resp) => resp.json());
}

function strip_html_tags(str: any) {
  if (str === null || str === '') {
    return false;
  } else {
    str = str.toString();
    return str.replace(/<[^>]*>/g, '');
    // return str;
  }
}

function run(): void {
  const port = process.env['PORT'] || 4001;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
