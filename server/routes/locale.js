import {langList, defaultLang} from '../../isomorphic/lang.js';

export default {
  register: async server => {
    server.ext('onRequest', (request, reply) => {
      const staticPath = `static`;
      const {pathname, origin} = request.url;
      //if it is a static resource, we don't need locale.
      if (pathname.startsWith(`/${staticPath}/`)) {
        return reply.continue;
      }
      const inURL = langList.reduce((a, n) => a || pathname.startsWith(`/${n.iso}/`), false);
      // TODO: see if there is a cookie value
      // TODO: read the http location header
      if (!inURL) {
        return reply.redirect(`/${defaultLang}${pathname}`).takeover();
      }
      return reply.continue;
    });
  },
  name: 'locale'
};
