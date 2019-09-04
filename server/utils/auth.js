import {OAuth2Client} from 'google-auth-library';
import {getSiteData} from './data.js';

export const verify = async token => {
  const {id} = await getSiteData();
  const client = new OAuth2Client(id);
  const ticket = await client.verifyIdToken({idToken: token, audience: data.id});
  return ticket.getPayload();
};
