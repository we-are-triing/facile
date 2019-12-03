import {fof} from '../templates/fourofour.js';
import header from '../data/header.js';
import Media from '../templates/media.js';
import {getMediaByFilename, getMediaList, getDerivativeMedia} from '../utils/data.js';
// TODO: have a better URL strategy.
const mediaDomain = `http://localhost:24042`;

export default server => {
  server.route([
    {
      method: `GET`,
      path: `/{lang}/media`,
      handler: async (req, h) => {
        try {
          const {lang} = req.params;
          const list = await getMediaList();
          const c = new Media({navigation: header.navigation, lang, list, baseUrl: mediaDomain});
          return c.render();
        } catch (err) {
          console.error(`content page failure`, err);
          return fof();
        }
      }
    },
    {
      method: `GET`,
      path: `/{lang}/media/new`,
      handler: async (req, h) => {
        try {
          const {lang} = req.params;
          const list = await getMediaList();
          const c = new Media({navigation: header.navigation, lang, list, media: 'new', baseUrl: mediaDomain});
          return c.render();
        } catch (err) {
          console.error(`content page failure`, err);
          return fof();
        }
      }
    },
    {
      method: `GET`,
      path: `/{lang}/media/{filename}`,
      handler: async (req, h) => {
        try {
          const {lang, filename} = req.params;
          const list = await getMediaList();
          const media = await getMediaByFilename(filename);
          media.derivatives = await getDerivativeMedia(media.filename);
          const c = new Media({navigation: header.navigation, lang, list: list, media, baseUrl: mediaDomain});
          return c.render();
        } catch (err) {
          console.error(`content page failure`, err);
          return fof();
        }
      }
    }
  ]);
};
