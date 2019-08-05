import buildShadowRoot from './buildShadowRoot.js';
import './form-boolean.js';
import './form-list.js';
import './form-number.js';
import './form-object.js';
import './form-region.js';
import './form-set.js';
import './form-string.js';
import './form-text.js';
import './form-text-block.js';

class RegionItem extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
        }
        img {
          width: 2em;
        }
      </style>
      <img />
      <span></span>
      <section>
        <slot></slot>
      </section>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      img: this.shadowRoot.querySelector('img'),
      type: this.shadowRoot.querySelector('span')
    };
  }

  static get observedAttributes() {
    return ['type', 'icon'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'type':
        this.elems.type.textContent = newVal;
        break;
      case 'icon':
        this.elems.img.setAttribute('src', newVal);
        break;
      default:
        break;
    }
  }

  get type() {
    return this.getAttribute('type');
  }
  set type(val) {
    if (val) {
      this.setAttribute('type', val);
    } else {
      this.removeAttribute('type');
    }
  }
  get icon() {
    return this.getAttribute('icon');
  }
  set icon(val) {
    if (val) {
      this.setAttribute('icon', val);
    } else {
      this.removeAttribute('icon');
    }
  }
}

customElements.define('region-item', RegionItem);
export default RegionItem;
