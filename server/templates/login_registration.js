import BaseTemplate from './base.js';
import d from '../data/facile-dictionary.js';

export default class LoginRegistration extends BaseTemplate {
  constructor({lang, clientID}) {
    super(lang);
    this.createParts();
    this.bodyClass = 'login';
    this.clientID = clientID;
  }
  createParts() {
    const title = `${this.getLang(d.facile_studio)} Login / Registration`;
    this.head.title = title;
    this.head.content = `<meta property="og:title" content="${title}">`;
  }
  lightHeader() {
    return `<site-language language="${this.lang}"></site-language>
    <h1>${this.getLang(d.welcome_to)} ${this.getLang(d.facile_studio)}!</h1>`;
  }
  async populatePage() {
    if (!this.clientID) {
      return `
        ${this.lightHeader()}
        <site-init org-label="${this.getLang(d.organization_name)}" create-label="${this.getLang(d.create)}"></site-init>
      `;
    }
    return 'you have a client ID!';

    // if there is no admin user / owner then show this:

    // if the site is inited, then show the login screen.
  }
}
