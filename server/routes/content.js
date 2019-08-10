import Content from '../templates/content.js';
import {fof} from '../templates/fourofour.js';
import header from '../data/header.js';
import {getContentList, getContentByName, getTemplateList, getTemplateByType} from './shared.js';

export default server => {
  server.route([
    {
      method: `GET`,
      path: `/{lang}/content`,
      handler: async (req, h) => {
        try {
          const {lang} = req.params;
          const contentList = await getContentList();
          const templateList = await getTemplateList();
          const c = new Content({navigation: header.navigation, lang, contentList, templateList});
          return c.render();
        } catch (err) {
          console.error(`content page failure`, err);
          return fof();
        }
      }
    },
    {
      method: `GET`,
      path: `/{lang}/content/new/{type}`,
      handler: async (req, h) => {
        try {
          const {lang, type} = req.params;
          const contentList = await getContentList();
          const template = await getTemplateByType(type);
          const templateList = await getTemplateList();
          const c = new Content({navigation: header.navigation, lang, contentList, templateList, template});
          return c.render();
        } catch (err) {
          console.error(`content page failure`, err);
          return fof();
        }
      }
    },
    {
      method: `GET`,
      path: `/{lang}/content/{name}`,
      handler: async (req, h) => {
        try {
          const {lang, name} = req.params;
          const contentList = await getContentList();
          const content = await getContentByName(name);
          const templateList = await getTemplateList();
          const template = await getTemplateByType(content.meta.type);
          const c = new Content({navigation: header.navigation, lang, contentList, content, templateList, template});
          return c.render();
        } catch (err) {
          console.error(`content page failure`, err);
          return fof();
        }
      }
    }
  ]);
};
