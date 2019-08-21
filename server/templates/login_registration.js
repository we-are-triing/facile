import BaseTemplate from './base.js';
import d from '../data/facile-dictionary.js';

export default class LoginRegistration extends BaseTemplate {
  constructor({lang}) {
    super(lang);
    this.createParts();
  }
  createParts() {
    const title = `${this.getLang(d.facile_studio)} Login / Registration`;
    this.head.title = title;
    this.head.content = `<meta property="og:title" content="${title}">`;
  }
  async populatePage() {
    return `
      <site-language language="${this.lang}"></site-language>
      <h1>${this.getLang(d.welcome_to)} ${this.getLang(d.facile_studio)}!</h1>
      <labeled-input>${this.getLang(d.organization_name)}</labeled-input>
      <revealed-choice>
        <a-choice>
          <label>${this.getLang(d.use_google)}</label>
          <main>
            <h2>${this.getLang(d.setup_google)}</h2>
            <labeled-input>clientId</labeled-input>
            <labeled-input>clientSecret</labeled-input>
            <labeled-input>location</labeled-input>
          </main>
        </a-choice>
        <a-choice>
          <label>${this.getLang(d.use_account)}</label>
          <main>
            <h2>${this.getLang(d.setup_account)}</h2>
            <labeled-input>${this.getLang(d.email)}</labeled-input>
            <labeled-input>${this.getLang(d.username)}</labeled-input>
            <labeled-password show-text="${this.getLang(d.show_password)}">${this.getLang(d.password)}</labeled-password>
          </main>
        </a-choice>
      </revealed-choice>
    `;
  }
}
