import { BrowserWindow } from 'electron';
import { backOff } from 'exponential-backoff';

import { sleep, waitRandomBetween } from './helpers';
import { ILogger } from './logger';
import { WorkerQueue } from './workerQueue';

const KNOWN_AUTHWALLS = ['authwall', 'login'];

/**
 * Wrapper over a headless window that can be used to download HTML.
 */
export class HtmlDownloader {
  private _isRunning = false;
  private _pool: BrowserWindowPool | undefined;

  /**
   * Class constructor.
   */
  constructor(private _logger: ILogger) {}

  /**
   * Initialize the headless window.
   */
  init() {
    this._pool = new BrowserWindowPool(2);
    this._isRunning = true;
  }

  /**
   * Load the HTML of a given URL with concurrency support.
   *
   * Takes in a callback that will be called with the HTML content. Will be retried if it fails
   * with a new version of the window's HTML. Using a callback instead of returning the HTML directly
   * because we need to keep the window aquired until the callback is finished.
   */
  async loadUrl<T>({
    url,
    scrollTimes = 3,
    callback,
  }: {
    url: string;
    scrollTimes?: number;
    callback: (_: { html: string; maxRetries: number; retryCount: number }) => Promise<T>;
  }): Promise<T> {
    if (!this._pool) throw new Error('Pool not initialized');

    return this._pool.useBrowserWindow(async (window) => {
      await this._loadUrl(window, url, scrollTimes);

      const maxRetries = 1;
      let retryCount = 0;
      return backOff(
        async () => {
          const html: string = await window.webContents.executeJavaScript('document.documentElement.innerHTML');
          return callback({ html, maxRetries, retryCount: retryCount++ });
        },
        {
          jitter: 'full',
          numOfAttempts: 1 + maxRetries,
          maxDelay: 5_000,
          startingDelay: 1_000,
          retry: () => {
            // perform retries only if the window is still running
            return this._isRunning;
          },
        },
      );
    });
  }

  /**
   * Close the headless window.
   */
  async close() {
    this._isRunning = false;
    return this._pool?.close();
  }

  /**
   * Load an URL and make sure to wait for the page to load.
   */
  private async _loadUrl(window: BrowserWindow, url: string, scrollTimes: number) {
    if (!this._isRunning) return '<html></html>';

    this._logger.info(`loading url: ${url} ...`);
    await backOff(
      async () => {
        let statusCode: number | undefined;
        window.webContents.once('did-navigate', (event, url, httpResponseCode) => {
          statusCode = httpResponseCode;
          this._logger.debug(`Navigated to URL: ${url} with status code: ${statusCode}`);
        });
        // Set headers to mimic a real browser
        window.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
          details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
          details.requestHeaders['sec-ch-ua'] = '"Not A(Brand";v="8", "Chromium";v="132"';
          details.requestHeaders['sec-ch-ua-mobile'] = '?0';
          details.requestHeaders['sec-ch-ua-platform'] = '"macOS"';
          details.requestHeaders['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8';
          details.requestHeaders['Accept-Encoding'] = 'gzip, deflate, br, zstd';
          details.requestHeaders['Accept-Language'] = 'en-US,en;q=0.9';
          details.requestHeaders['Connection'] = 'keep-alive';
          details.requestHeaders['Referer'] = 'https://example.com';
          details.requestHeaders['Sec-Fetch-Site'] = 'same-origin';
          details.requestHeaders['Sec-Fetch-Mode'] = 'navigate';
          details.requestHeaders['Sec-Fetch-Dest'] = 'document';
          details.requestHeaders['Cookie'] = 'CTK=1ijp4hmpfhpmi800; PREF="TM=1739231648582:L=Delft"; SURF=1ZLgMixSEppZGOzsgGpeA7wYLjPRh8tv; indeed_rcc=CTK; cp=1; SESSION_START_TIME=1739656845832; SESSION_ID=1ik5q1mg7j0oq800; SESSION_END_TIME=1739656848709; OptanonAlertBoxClosed=2025-02-15T22:01:49.303Z; LV=LA=1739733145:LV=1739231648:CV=1739733145:TS=1739231648; LC="co=NL"; cf_clearance=5n70NjtF3c2eeGJAcRhPlghlS46SbzpKVxnjlbv26Uk-1739733148-1.2.1.1-wjO9oSi7D.egM57usVBK30T58OgVG2bGXzH2zojo.CR41xwT8UYT1V3Rwld8UXgz96yOX2Sx695eb3W7p1Qb5bnRjhcMSueCQD7EnY87ZE2jgQ3VTis2XI2QN6_CyZh2Ujjs9CTPnho1BDs8C9mmW.yn0Ij7drbO_QjmbDYBvajk8f7P5Ubz4n_.m.TBS3mE3fYIWkl6ZC7PNjxdih4k8Kfa6c1YEhalQISSKp06GUJTmu.KqnUtMXRLHfnki2J1KeCZ.9XIAWnpPKjseLiCLei39nF6_kY9VvzAZ9ReFTNd1eW__x2xy8d5r4uSXEV.nkAp5Va7FonIs2OZh5Xrgg; RQ=q=product+manager&l=Delft&ts=1739733169612&pts=1739231648620; _ga=GA1.1.534584097.1739733185; FPID=FPID2.2.VdwGOn9ffh5t3SflMbxisE4dKKKSlWJSW4g7vX7zR%2Bc%3D.1739733185; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Feb+16+2025+20%3A13%3A41+GMT%2B0100+(Central+European+Standard+Time)&version=202409.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=58e98fac-6eb8-41fc-846e-1f5486e1eb41&interactionCount=2&isAnonUser=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0007%3A0&AwaitingReconsent=false&intType=2&geolocation=%3B; _ga_LYNT3BTHPG=GS1.1.1739733185.1.1.1739733221.0.0.1700077096; __cf_bm=8NN35Kunkyh2qPf.iMdj0Ji4h14UJkH_WqilqVh_03Q-1739832144-1.0.1.1-F_xwB4LkkRgiFbHkUhsI_H.qYZFLYWxMM..lfgUIc.hITkxbANBb1PeSkJx5zi8eexKoDehC5Yi.FasGkyPO0w; cf_chl_rc_m=29';
          // this._logger.debug(`Request headers set: ${JSON.stringify(details.requestHeaders)}`);
          callback({ cancel: false, requestHeaders: details.requestHeaders });
        });
        await window.loadURL(url);

        // handle rate limits
        const title = await window.webContents.executeJavaScript('document.title');
        if (statusCode === 429 || title?.toLowerCase().startsWith('just a moment')) {
          this._logger.debug(`429 status code detected: ${url}`);
          await waitRandomBetween(20_000, 40_000);
          throw new Error('rate limit exceeded');
        }

        // scroll to bottom a few times to trigger infinite loading
        for (let i = 0; i < scrollTimes; i++) {
          await window.webContents.executeJavaScript(
            `
              Array.from(document.querySelectorAll('*'))
                .filter(el => el.scrollHeight > el.clientHeight)
                .forEach(el => el.scrollTop = el.scrollHeight);
            `,
          );
          await sleep(2_000);

          // check if page was redirected to a login page
          const finalUrl = window.webContents.getURL();
          if (KNOWN_AUTHWALLS.some((authwall) => finalUrl?.includes(authwall))) {
            this._logger.debug(`authwall detected: ${finalUrl}`);
            throw new Error('authwall');
          }
        }
      },
      {
        jitter: 'full',
        numOfAttempts: 20,
        maxDelay: 5_000,
        retry: () => {
          // perform retries only if the window is still running
          return this._isRunning;
        },
      },
    );

    this._logger.info(`finished loading url: ${url}`);
  }
}

/**
 * Class used to manage a pool of headless windows.
 */
class BrowserWindowPool {
  private _pool: Array<{
    id: number;
    window: BrowserWindow;
    isAvailable: boolean;
  }> = [];
  private _queue: WorkerQueue;

  /**
   * Class constructor.
   */
  constructor(instances: number) {
    for (let i = 0; i < instances; i++) {
      const window = new BrowserWindow({
        show: false,
        // set the window size
        width: 1600,
        height: 1200,
        webPreferences: {
          // disable the same origin policy
          webSecurity: false,
          partition: `persist:scraper`,
        },
      });

      // disable LinkedIn's passkey request, because it triggers an annoying popup
      window.webContents.session.webRequest.onBeforeRequest((details, callback) => {
        // if the request url matches the url which appears to be sending the passkey request
        if (details.url.includes('checkpoint/pk/initiateLogin')) {
          // never call the callback to block the request
        } else {
          callback({});
        }
      });

      this._pool.push({
        id: i,
        window,
        isAvailable: true,
      });
    }

    this._queue = new WorkerQueue(instances);
  }

  /**
   * Get an available window and use it.
   */
  async useBrowserWindow<T>(fn: (window: BrowserWindow) => Promise<T>) {
    return this._queue.enqueue(() => {
      const worker = this._pool.find((w) => w.isAvailable);
      if (!worker) throw new Error('No available window found');
      worker.isAvailable = false;

      return fn(worker.window).finally(() => {
        worker.isAvailable = true;
      });
    });
  }

  /**
   * Wait until all windows are available and close them.
   */
  close() {
    return new Promise<void>((resolve) => {
      // wait until the queue is empty
      this._queue.on('empty', () => {
        this._pool.forEach((w) => w.window.close());

        // artificial delay to allow the window to close
        setTimeout(() => resolve(), 500);
      });

      // trigger the empty event if the queue is already empty
      this._queue.next();
    });
  }
}
