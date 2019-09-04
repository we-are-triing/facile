import buildShadowRoot from './buildShadowRoot.js';
import {initSite} from '../utils/services.js';
import './labeled-input.js';
import './styled-button.js';

class SiteInit extends HTMLElement {
  constructor() {
    super();
    const html = /*html*/ `
      <style>
        :host {
        }
      </style>
      <slot></slot>
      <labeled-input class="org"></labeled-input>
      <labeled-input class="clientID">clientId</labeled-input>
      <labeled-input class="secret">clientSecret</labeled-input>
      <styled-button></styled-button>
      <a href="https://developers.google.com/identity/sign-in/web/sign-in?authuser=1">setup google project.</a>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      org: this.shadowRoot.querySelector('.org'),
      id: this.shadowRoot.querySelector('.clientID'),
      secret: this.shadowRoot.querySelector('.secret'),
      create: this.shadowRoot.querySelector('styled-button')
    };
    this.elems.create.addEventListener('click', this.handleCreate.bind(this));
  }

  async handleCreate() {
    const obj = {
      org: this.elems.org.value,
      id: this.elems.id.value,
      secret: this.elems.secret.value
    };
    if (obj.org && obj.id && obj.secret) {
      await initSite(obj);
    }
    // then redirect to yourself.
    window.location.reload();
  }

  static get observedAttributes() {
    return ['org-label', 'create-label'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'org-label':
        this.elems.org.textContent = newVal;
        break;
      case 'create-label':
        this.elems.create.textContent = newVal;
        break;
      default:
        break;
    }
  }

  get orgLabel() {
    return this.getAttribute('org-label');
  }
  set orgLabel(val) {
    if (val) {
      this.setAttribute('org-label', val);
    } else {
      this.removeAttribute('org-label');
    }
  }
  get createLabel() {
    return this.getAttribute('create-label');
  }
  set createLabel(val) {
    if (val) {
      this.setAttribute('create-label', val);
    } else {
      this.removeAttribute('create-label');
    }
  }
}

customElements.define('site-init', SiteInit);
export default SiteInit;
