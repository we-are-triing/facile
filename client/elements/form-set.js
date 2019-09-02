import buildShadowRoot from './buildShadowRoot.js';
import './labeled-select.js';

class FormSet extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block;
        }
      </style>
      <labeled-select><slot></slot></labeled-select>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      select: this.shadowRoot.querySelector('labeled-select')
    };
    this.observer = this.watchChildren();
    this.updateChildren();
    this.elems.select.addEventListener('change', this.handleChange.bind(this));
  }

  watchChildren() {
    return new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        this.updateChildren();
      });
    });
  }

  updateChildren() {
    this.observer.disconnect();

    [...this.elems.select.children].forEach(child => child.remove());

    [...this.children].forEach((child, i) => {
      if (!this.value && i === 0) {
        this.value = child.value || child.textContent;
      }
      if (child.localName === 'option') {
        this.elems.select.appendChild(child.cloneNode(true));
      }
    });

    this.observer.observe(this, {childList: true});
  }

  handleChange(e) {
    this.value = this.elems.select.value;
    this.dispatchEvent(
      new Event('change', {
        bubbles: true
      })
    );
  }

  static get observedAttributes() {
    return ['value', 'label'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'value':
        this.elems.select.value = newVal;
        break;
      case 'label':
        this.elems.select.label = newVal;
        break;
      default:
        break;
    }
  }

  get value() {
    return this.getAttribute('value');
  }
  set value(val) {
    if (val) {
      this.setAttribute('value', val);
    } else {
      this.removeAttribute('value');
    }
  }
  get label() {
    return this.getAttribute('label');
  }
  set label(val) {
    if (val) {
      this.setAttribute('label', val);
    } else {
      this.removeAttribute('label');
    }
  }
}

customElements.define('form-set', FormSet);
export default FormSet;
