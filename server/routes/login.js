import LoginRegistration from '../templates/login_registration.js';
import {fof} from '../templates/fourofour.js';
import {getSiteData} from '../utils/data.js';

export default server => {
  server.route([
    {
      method: `GET`,
      path: `/{lang}/login`,
      handler: async (req, h) => {
        try {
          const {lang} = req.params;
          const {id} = await getSiteData();
          const login = new LoginRegistration({lang, clientID: id});
          return login.render();
        } catch (err) {
          console.error(`login / registration page failure`, err);
          return fof();
        }
      }
    }
  ]);
};
