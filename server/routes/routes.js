import Home from '../templates/home.js';
import Components from '../templates/components.js';
import Templates from '../templates/templates.js';
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
const getSimpleComponentList = async () => {
  const temp = await getComponentList();
  return simplifyComponentList(temp);
};
const simplifyComponentList = list => list.map(({meta}) => ({icon: meta.icon, type: meta.type, tags: meta.tags}));
const getComponentList = async () => {
  const raw = await fetch(`${dataDomain}/content/components`);
  return raw.json();
};
const getTemplateList = async () => {
  const raw = await fetch(`${dataDomain}/content/templates`);
  return raw.json();
};

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

          const components = await getSimpleComponentList();

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
      path: `/{lang}/component/new`,
      handler: async (req, h) => {
        try {
          const {lang} = req.params;

          const components = await getSimpleComponentList();
          const c = new Components({navigation: header.navigation, components, component: 'new', lang});
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

          const components = await getSimpleComponentList();
          const raw = await fetch(`${dataDomain}/content/component/${type}`);
          const [component] = await raw.json();

          const c = new Components({navigation: header.navigation, components, component, lang});
          return c.render();
        } catch (err) {
          console.error(`component page failure`, err);
          return fourOFour();
        }
      }
    },
    {
      method: `GET`,
      path: `/{lang}/templates`,
      handler: async (req, h) => {
        try {
          const {lang} = req.params;

          const templates = await getTemplateList();

          const t = new Templates({navigation: header.navigation, templates, lang});
          return t.render();
        } catch (err) {
          console.error(`component page failure`, err);
          return fourOFour();
        }
      }
    },
    {
      method: `GET`,
      path: `/{lang}/template/new`,
      handler: async (req, h) => {
        try {
          const {lang} = req.params;

          const templates = await getTemplateList();
          const components = await getSimpleComponentList();

          const t = new Templates({navigation: header.navigation, templates, components, template: 'new', lang});
          return t.render();
        } catch (err) {
          console.error(`template page failure`, err);
          return fourOFour();
        }
      }
    },
    {
      method: `GET`,
      path: `/{lang}/template/{type}`,
      handler: async (req, h) => {
        try {
          const {lang, type} = req.params;

          const templates = await getTemplateList();

          const clist = await getSimpleComponentList();
          const components = clist.map();

          const raw = await fetch(`${dataDomain}/content/template/${type}`);
          const [template] = await raw.json();

          const t = new Templates({navigation: header.navigation, templates, components, template, lang});
          return t.render();
        } catch (err) {
          console.error(`template page failure`, err);
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
