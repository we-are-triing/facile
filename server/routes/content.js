import Content from '../templates/content.js';
import {fof} from '../templates/fourofour.js';
import fetch from 'node-fetch';
import header from '../data/header.js';
import {getContentList, dataDomain} from './shared.js';

export default server => {
  server.route([
    {
      method: `GET`,
      path: `/{lang}/content`,
      handler: async (req, h) => {
        try {
          const {lang} = req.params;

          const raw = await fetch(`${dataDomain}/content`);
          const content = await raw.json();

          const c = new Content({navigation: header.navigation, lang});
          return c.render();
        } catch (err) {
          console.error(`content page failure`, err);
          return fof();
        }
      }
    },
    {
      method: `GET`,
      path: `/{lang}/content/new`,
      handler: async (req, h) => {
        try {
          const {lang} = req.params;

          const raw = await fetch(`${dataDomain}/content`);
          const content = await raw.json();

          const c = new Content({navigation: header.navigation, lang});
          return c.render();
        } catch (err) {
          console.error(`content page failure`, err);
          return fof();
        }
      }
    },
    {
      method: `GET`,
      path: `/{lang}/content/{type}`,
      handler: async (req, h) => {
        try {
          const {lang} = req.params;

          const raw = await fetch(`${dataDomain}/content`);
          const content = await raw.json();

          const c = new Content({navigation: header.navigation, lang});
          return c.render();
        } catch (err) {
          console.error(`content page failure`, err);
          return fof();
        }
      }
    }
  ]);
};
