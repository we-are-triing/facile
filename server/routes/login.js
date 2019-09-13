import LoginRegistration from '../templates/login_registration.js';
import {fof} from '../templates/fourofour.js';
import {getSiteData, checkForAdmin, registerUser, getUser} from '../utils/data.js';
import {verify} from '../utils/auth.js';
import joi from '@hapi/joi';
import boom from '@hapi/boom';

export default server => {
  server.route([
    {
      method: `GET`,
      path: `/{lang}/login`,
      options: {
        auth: {
          mode: 'try'
        },
        plugins: {
          'hapi-auth-cookie': {
            redirectTo: false
          }
        }
      },
      handler: async (req, h) => {
        try {
          if (req.auth.isAuthenticated) {
            return h.redirect('/');
          }
          const {lang} = req.params;
          const {id} = await getSiteData();
          const hasAdmin = await checkForAdmin();
          const login = new LoginRegistration({lang, clientID: id, hasAdmin});
          return login.render();
        } catch (err) {
          console.error(`login / registration page failure`, err);
          return fof();
        }
      }
    },

    {
      method: `POST`,
      path: `/api/register`,
      options: {
        description: `endpoint to register user.`,
        notes: `this allows me to register user.`,
        tags: [`api`],
        validate: {
          payload: {
            token: joi.string().required(),
            profile: {
              name: joi.string().required(),
              email: joi.string().required(),
              img: joi.string().required()
            },
            roles: joi
              .array()
              .items(joi.string())
              .required(),
            admin: joi.boolean().required(),
            translator: joi.array().items(joi.string())
          }
        }
      },
      handler: async (req, h) => {
        try {
          const {token, profile, roles, admin, translator} = req.payload;
          const payload = await verify(token);
          const id = payload.sub;
          return await registerUser({id, profile, roles, admin, translator});
        } catch (err) {
          console.error(`login / registration page failure`, err);
          return fof();
        }
      }
    },
    {
      method: `POST`,
      path: `/api/login`,
      options: {
        description: `endpoint to log the user in.`,
        notes: `this allows me to log the user in.`,
        tags: [`api`],
        validate: {
          payload: {
            token: joi.string().required()
          }
        },
        auth: {
          mode: 'try'
        },
        plugins: {
          'hapi-auth-cookie': {
            redirectTo: false
          }
        }
      },
      handler: async (req, h) => {
        try {
          const {token} = req.payload;
          // I have the google token here.
          const payload = await verify(token);
          const user = await getUser(payload.sub);
          if (!user) {
            return boom.unauthorized(`You don't belong here.`);
          }
          req.cookieAuth.set({id: user.id});
          return user;
        } catch (err) {
          console.error(`login / registration page failure`, err);
          return fof();
        }
      }
    }
  ]);
};
