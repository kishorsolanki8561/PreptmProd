import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { basename, dirname, join, resolve } from 'node:path';
import { LOCALE_ID } from '@angular/core';
import AppServerModule from 'src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {

  
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));

  // get the language from the corresponding folder
  const lang = basename(serverDistFolder);

  // set the route for static content and APP_BASE_HREF
  const langPath = `/${lang}/`;

  // Note that the 'browser' folder is located two directories above 'server/{lang}/'
  const browserDistFolder = resolve(serverDistFolder, `../../browser/${lang}`);
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser

  // complete the route for static content by concatenating the language
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {

    // Discard baseUrl as we will provide it with langPath
    const { protocol, originalUrl, headers } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        // publicPath does not need to concatenate the language.
        publicPath: resolve(serverDistFolder, `../../browser/${lang}`),
        providers: [
          { provide: APP_BASE_HREF, useValue: langPath.includes('en')?'/': langPath},
          { provide: LOCALE_ID, useValue: lang },
          // { provide: "IS_MOBILE", useValue: (req as any)['isMobile']},
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}
