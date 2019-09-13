import BaseTemplate from './base.js';
import d from '../data/facile-dictionary.js';

export default class LoginRegistration extends BaseTemplate {
  constructor({lang, clientID, hasAdmin}) {
    super(lang);
    this.createParts();
    this.bodyClass = 'login';
    this.clientID = clientID;
    this.hasAdmin = hasAdmin;
  }
  createParts() {
    const title = `${this.getLang(d.facile_studio)} Login / Registration`;
    this.head.title = title;
    this.head.content = `<meta property="og:title" content="${title}">`;
  }
  lightHeader() {
    return `<site-language language="${this.lang}"></site-language>`;
  }
  addAuth() {
    return `
      <script>
        // TODO: not sure a different way to get around this yet.
        function googleinit() {
          if (stiva) {
            stiva.dispatch('auth-init',{init: true});
          }
        }
      </script>
      <script src="https://apis.google.com/js/platform.js?onload=googleinit" defer></script>
    `;
  }
  async populatePage() {
    if (!this.clientID) {
      return `
        ${this.lightHeader()}
        <h1>${this.getLang(d.welcome_to)} ${this.getLang(d.facile_studio)}!</h1>
        <site-init org-label="${this.getLang(d.organization_name)}" create-label="${this.getLang(d.create)}"></site-init>
      `;
    }
    if (!this.hasAdmin) {
      return `
        ${this.lightHeader()}
        ${this.addAuth()}
        <site-register client-id="${this.clientID}" admin></site-regiser>
      `;
    }
    return `
      ${this.lightHeader()}
      ${this.addAuth()}
      <site-login client-id="${this.clientID}"></site-login>
    `;
  }
}
