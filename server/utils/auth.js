import lib from 'google-auth-library';
import {getSiteData, getUser} from './data.js';

const OAuth2Client = lib.OAuth2Client;

export const verify = async token => {
  const {id} = await getSiteData();
  const client = new OAuth2Client(id);
  const ticket = await client.verifyIdToken({idToken: token, audience: id});
  return ticket.getPayload();
};

// TODO: setup authorization as well as authentication
const auth = async (request, session) => {
  const user = await getUser(session.id);
  // TODO: need to secure this call, somehow.
  if (!user) {
    return {valid: false};
  }

  return {valid: true, credentials: user};
};

export const setupAuth = server => {
  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'facile',
      password: server.app.secret,
      // TODO: For working via HTTP in localhost
      isSecure: false,
      path: '/'
    },
    redirectTo: '/login',
    validateFunc: auth
  });
  server.auth.default({
    strategy: 'session',
    mode: 'required'
  });
};
