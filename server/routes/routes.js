import Home from '../templates/home.js';
import Components from '../templates/components.js';
import FourOFour from '../templates/fourofour.js';
import fetch from 'node-fetch';
import {join} from 'path';
import require from './require.cjs';
import LoginRegistration from '../templates/login_registration.js';
import header from '../data/header.js';

const fetchOptions = {
  mode: 'cors',
  headers: {'Content-Type': 'application/json'}
};

const port = process.env.PORT || 8000;
const dataDomain = `http://api:8001`;

const fourOFour = () => {
  const fof = new FourOFour({navigation: header.navigation});
  return fof.render();
};

export default server => {
  const polyfillsURL = require.resolve('@webcomponents/webcomponentsjs');
  const stivaURL = require.resolve('stiva');

  // STATIC Routes
  server.route({
    method: `GET`,
    path: `/static/{param*}`,
    handler: {
      directory: {
        path: 'client'
      }
    }
  });

  server.route({
    method: `GET`,
    path: `/static/isomorphic/{param*}`,
    handler: {
      directory: {
        path: 'isomorphic'
      }
    }
  });

  server.route({
    method: `GET`,
    path: `/static/polyfills/{param*}`,
    handler: {
      directory: {
        path: join(polyfillsURL, '../')
      }
    }
  });

  server.route({
    method: `GET`,
    path: `/static/stiva.js`,
    handler: {
      file: stivaURL
    }
  });

  // Dynamic Routes
  server.route([
    {
      method: `GET`,
      path: `/{lang}/`,
      handler: async (req, h) => {
        try {
          // Simulating a fetch to some service to get content.
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
    },
    {
      method: `GET`,
      path: `/{lang}/components`,
      handler: async (req, h) => {
        try {
          const {lang} = req.params;

          const raw = await fetch(`${dataDomain}/content/components`);
          const components = await raw.json();

          const c = new Components({navigation: header.navigation, components, lang});
          return c.render();
        } catch (err) {
          console.error(`component page failure`, err);
          return fourOFour();
        }
      }
    },
    {
      method: `GET`,
      path: `/{lang}/component/{type}`,
      handler: async (req, h) => {
        try {
          const {lang, type} = req.params;
          const raw = await fetch(`http://localhost:${port}/api/home`, {method: 'GET'});
          const json = await raw.json();
          const home = new Components({...json, lang});
          return home.render();
        } catch (err) {
          console.error(`component page failure`, err);
          return fourOFour();
        }
      }
    },
    {
      method: `GET`,
      path: `/{lang}/login`,
      handler: async (req, h) => {
        try {
          const {lang} = req.params;
          const login = new LoginRegistration({lang});
          return login.render();
        } catch (err) {
          console.error(`login / registration page failure`, err);
          return fourOFour();
        }
      }
    }
  ]);
};
