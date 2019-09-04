import {langList, defaultLang} from '../../isomorphic/lang.js';
import {isStaticPath} from './shared.js';
import {cookie} from '../utils/cookie.js';

const inURL = pathname => langList.reduce((a, n) => a || pathname.startsWith(`/${n.iso}/`), false);

export default {
  register: async server => {
    server.ext('onRequest', (req, h) => {
      let lang = defaultLang;
      const {pathname} = req.url;
      //if it is a static resource, we don't need locale.
      if (isStaticPath(pathname) || inURL(pathname)) {
        return h.continue;
      }

      if (req.headers.cookie && req.headers.cookie.indexOf('lang=') > -1) {
        lang = cookie(req.headers.cookie).lang || lang;
      }

      // TODO: read the http location header (req.headers['accept-language'])
      return h.redirect(`/${lang}${pathname}`).takeover();
    });
  },
  name: 'locale'
};
