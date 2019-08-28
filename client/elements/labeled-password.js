import buildShadowRoot from './buildShadowRoot.js';
import './labeled-input.js';
import './an-icon.js';

class LabeledPassword extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block;
        }
        labeled-input {
          display: inline;
        }
        an-icon {
          cursor: pointer;
          opacity: 0.3;
        }
        :host([show]) an-icon {
          opacity: 1;
        }
      </style>
      <labeled-input name="input" type="password"><slot></slot></labeled-input>
      <an-icon type="show"></an-icon>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      input: this.shadowRoot.querySelector('labeled-input'),
      icon: this.shadowRoot.querySelector('an-icon')
    };
    this.elems.icon.addEventListener('click', this.handleShow.bind(this));
  }

  static get observedAttributes() {
    return ['show', 'show-text'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'show':
        if (newVal === '' || newVal) {
          this.elems.input.setAttribute('type', 'text');
        } else {
          this.elems.input.setAttribute('type', 'password');
        }
        break;
      case 'show-text':
        this.elems.icon.title = newVal;
        break;
      default:
        break;
    }
  }

  get show() {
    return this.hasAttribute('show');
  }
  set show(val) {
    if (val) {
      this.setAttribute('show', '');
    } else {
      this.removeAttribute('show');
    }
  }

  get showText() {
    return this.hasAttribute('show-text');
  }
  set showText(val) {
    if (val) {
      this.setAttribute('show-text', '');
    } else {
      this.removeAttribute('show-text');
    }
  }

  handleShow(e) {
    this.show = !this.show;
  }
}

customElements.define('labeled-password', LabeledPassword);
export default LabeledPassword;
