import Components from '../templates/components.js';
import {fof} from '../templates/fourofour.js';
import fetch from 'node-fetch';
import {getSimpleComponentList, dataDomain} from './shared.js';
import header from '../data/header.js';

export default server => {
  server.route([
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
          return fof();
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
          return fof();
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
          const raw = await fetch(`${dataDomain}/component/${type}`);
          const [component] = await raw.json();

          const c = new Components({navigation: header.navigation, components, component, lang});
          return c.render();
        } catch (err) {
          console.error(`component page failure`, err);
          return fof();
        }
      }
    }
  ]);
};
