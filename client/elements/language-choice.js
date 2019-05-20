import buildShadowRoot from './buildShadowRoot.js';
import {langList, defaultLang} from '../isomorphic/lang.js';
import './an-icon.js';

class LanguageChoice extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          display: block;
          text-align: right;
          position: relative;
        }
        ul {
          margin: 0;
          padding: 0;
          right: 0;
          display: none;
          position: absolute;
          background: var(--white);
          padding: var(--spacing-300);
          border: var(--border);
          border-radius: var(--br-400);
          text-align: left;
        }
        ul.active {
          display: block;
        }
        an-icon {
          cursor: pointer;
        }
        li {
          display: flex;
          padding: var(--spacing-100) 0;
          cursor: pointer;
        }
        li an-icon {
          padding-right: var(--spacing-200);
        }
      </style>
      <an-icon class="selected" type="eng"></an-icon>
      <ul>
        ${langList.map(({iso, name}) => `<li><an-icon type="${iso}"></an-icon>${name}</li>`).join('')}
      </ul>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      flag: this.shadowRoot.querySelector('an-icon.selected'),
      list: this.shadowRoot.querySelector('ul')
    };
    this.elems.flag.addEventListener('click', this.handleClick.bind(this));
    this.elems.list.addEventListener('click', this.handleChange.bind(this));
  }

  static get observedAttributes() {
    return ['language'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'language':
        this.elems.flag.setAttribute('type', newVal);
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

  handleClick(e) {
    this.elems.list.classList.toggle('active');
  }
  handleChange(e) {
    let lang = this.elems.flag.type;
    if (e.target.localName === 'li') {
      lang = e.target.querySelector('an-icon').type;
    } else if (e.target.localName === 'an-icon') {
      lang = e.target.type;
    }

    if (lang !== this.elems.flag.type) {
      this.elems.flag.type = lang;
      this.elems.list.classList.remove('active');
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: {
            language: lang
          }
        })
      );
    }
  }
}

customElements.define('language-choice', LanguageChoice);
export default LanguageChoice;
