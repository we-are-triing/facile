import {cookie} from '../utils/cookie.js';
import {isStaticPath} from './shared.js';

const isLogin = path => path.endsWith('login');
const hasAccess = async () => {
  return false;
};

export default {
  register: async server => {
    server.ext('onRequest', async (req, h) => {
      const {pathname} = req.url;

      if (isLogin(pathname) || isStaticPath(pathname)) {
        return h.continue;
      }

      if (await hasAccess()) {
        return h.continue;
      }

      return h.redirect(`/login`).takeover();
    });
  },
  name: 'auth'
};
