import buildShadowRoot from './buildShadowRoot.js';
import {registerUser} from '../utils/services.js';
import './site-login.js';
import './labeled-input.js';
import './check-box.js';
import './styled-button.js';

class SiteRegister extends HTMLElement {
  constructor() {
    super();
    const html = /*html*/ `
      <style>
        :host {
        }
        :host([admin]) .admin {
          display: none;
        }
      </style>
      <site-login no-verify></site-login>
      <labeled-input class="name">Name</labeled-input>
      <labeled-input class="email">Email</labeled-input>
      <labeled-input class="img">Profile Picture</labeled-input>
      <check-box class="editor">Editor</check-box>
      <check-box class="designer">Designer</check-box>
      <check-box class="admin">Admin</check-box>
      <labeled-input class="langs">Languages</labeled-input>
      <styled-button class="register">Register</styled-button>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      login: this.shadowRoot.querySelector('site-login'),
      name: this.shadowRoot.querySelector('.name'),
      email: this.shadowRoot.querySelector('.email'),
      img: this.shadowRoot.querySelector('.img'),
      editor: this.shadowRoot.querySelector('.editor'),
      designer: this.shadowRoot.querySelector('.designer'),
      admin: this.shadowRoot.querySelector('.admin'),
      langs: this.shadowRoot.querySelector('.langs'),
      register: this.shadowRoot.querySelector('.register')
    };

    this.elems.login.addEventListener('auth', this.handleAuth.bind(this));
    this.elems.register.addEventListener('click', this.handleRegister.bind(this));
  }

  handleAuth(e) {
    const {token, profile} = e.detail;
    this.elems.name.value = profile.name;
    this.elems.email.value = profile.email;
    this.elems.img.value = profile.img;
    this.token = token;
  }

  async handleRegister(e) {
    const roles = ['author'];
    if (this.elems.editor.value) {
      roles.push('editor');
    }
    if (this.elems.designer.value) {
      roles.push('designer');
    }
    const user = await registerUser({
      token: this.token,
      name: this.elems.name.value,
      email: this.elems.email.value,
      img: this.elems.img.value,
      roles,
      admin: this.admin || this.elems.admin.value,
      translator: this.elems.langs.value ? this.elems.langs.value.split(',') : []
    });

    window.location.reload();
  }

  static get observedAttributes() {
    return ['client-id', 'admin'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'client-id':
        this.elems.login.clientID = newVal;
        break;
      default:
        break;
    }
  }

  get clientID() {
    return this.getAttribute('client-id');
  }
  set clientID(val) {
    if (val) {
      this.setAttribute('client-id', val);
    } else {
      this.removeAttribute('client-id');
    }
  }
  get admin() {
    return this.hasAttribute('admin');
  }
  set admin(val) {
    if (val) {
      this.setAttribute('admin', '');
    } else {
      this.removeAttribute('admin');
    }
  }
}

customElements.define('site-register', SiteRegister);
export default SiteRegister;
