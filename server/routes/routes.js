import Home from '../templates/home.js';
import {join} from 'path';
import require from './require.cjs';
import content from './content.js';
import templates from './templates.js';
import components from './components.js';
import media from './media.js';
import login from './login.js';
import proxy from './proxy.js';
import {fof} from '../templates/fourofour.js';
import header from '../data/header.js';

const port = process.env.PORT || 8000;

export default server => {
  const polyfillsURL = require.resolve('@webcomponents/webcomponentsjs');
  const stivaURL = require.resolve('stiva');

  // STATIC Routes
  server.route([
    {
      method: `GET`,
      path: `/static/{param*}`,
      options: {
        auth: false
      },
      handler: {
        directory: {
          path: 'client'
        }
      }
    },
    {
      method: `GET`,
      path: `/static/isomorphic/{param*}`,
      options: {
        auth: false
      },
      handler: {
        directory: {
          path: 'isomorphic'
        }
      }
    },
    {
      method: `GET`,
      path: `/static/workers/{param*}`,
      options: {
        auth: false
      },
      handler: {
        directory: {
          path: 'client/workers'
        }
      }
    },
    {
      method: `GET`,
      path: `/static/polyfills/{param*}`,
      options: {
        auth: false
      },
      handler: {
        directory: {
          path: join(polyfillsURL, '../')
        }
      }
    },
    {
      method: `GET`,
      path: `/static/stiva.js`,
      options: {
        auth: false
      },
      handler: {
        file: stivaURL
      }
    }
  ]);

  // Dynamic Routes
  server.route([
    {
      method: `GET`,
      path: `/{lang}/`,
      handler: async (req, h) => {
        try {
          const {lang} = req.params;
          const home = new Home({lang, title: 'home', navigation: header.navigation});
          return home.render();
        } catch (err) {
          console.error(`home page failure`, err);
          return fof();
        }
      }
    }
  ]);
  login(server);
  components(server);
  templates(server);
  content(server);
  media(server);
  proxy(server);
};
