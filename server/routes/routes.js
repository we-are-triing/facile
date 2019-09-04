import Home from '../templates/home.js';
import fetch from 'node-fetch';
import {join} from 'path';
import require from './require.cjs';
import LoginRegistration from '../templates/login_registration.js';
import content from './content.js';
import templates from './templates.js';
import components from './components.js';
import media from './media.js';
import login from './login.js';

const port = process.env.PORT || 8000;

export default server => {
  const polyfillsURL = require.resolve('@webcomponents/webcomponentsjs');
  const stivaURL = require.resolve('stiva');

  // STATIC Routes
  server.route([
    {
      method: `GET`,
      path: `/static/{param*}`,
      handler: {
        directory: {
          path: 'client'
        }
      }
    },
    {
      method: `GET`,
      path: `/static/isomorphic/{param*}`,
      handler: {
        directory: {
          path: 'isomorphic'
        }
      }
    },
    {
      method: `GET`,
      path: `/static/workers/{param*}`,
      handler: {
        directory: {
          path: 'client/workers'
        }
      }
    },
    {
      method: `GET`,
      path: `/static/polyfills/{param*}`,
      handler: {
        directory: {
          path: join(polyfillsURL, '../')
        }
      }
    },
    {
      method: `GET`,
      path: `/static/stiva.js`,
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
          const raw = await fetch(`http://localhost:${port}/api/home`);
          const json = await raw.json();
          const home = new Home({...json, lang});
          return home.render();
        } catch (err) {
          console.error(`home page failure`, err);
          return fourOFour();
        }
      }
    }
  ]);
  login(server);
  components(server);
  templates(server);
  content(server);
  media(server);
};
