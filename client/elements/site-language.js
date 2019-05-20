import buildShadowRoot from './buildShadowRoot.js';
import {langList} from '../isomorphic/lang.js';
import './language-choice.js';

class SiteLanguage extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          display: block;
        }
      </style>
      <language-choice language="eng"></language-choice>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      lang: this.shadowRoot.querySelector('language-choice')
    };
    this.elems.lang.addEventListener('change', this.handleLang.bind(this));
  }

  static get observedAttributes() {
    return ['language'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'language':
        this.elems.lang.setAttribute('language', newVal);
        break;
      default:
        break;
    }
  }

  get language() {
    return this.getAttribute('language');
  }
  set language(val) {
    if (val) {
      this.setAttribute('language', val);
    } else {
      this.removeAttribute('language');
    }
  }

  handleLang(e) {
    const {origin, pathname} = window.location;
    // set cookie
    // redirect page
    const inURL = langList.reduce((a, n) => a || pathname.startsWith(`/${n.iso}/`), false);
    if (inURL) {
      const p = pathname.substring(4);
      window.location = `${origin}/${e.detail.language}${p}`;
    } else {
      window.location = `${origin}/${e.detail.language}${pathname}`;
    }
  }
}

customElements.define('site-language', SiteLanguage);
export default SiteLanguage;
