import buildShadowRoot from './buildShadowRoot.js';

class RegionItem extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block; 
          margin: var(--spacing-400);
         --main-color: var(--main, #ccc);
        }
        header {
          display: flex;
          align-items: center;
          background: var(--main-color);
          padding: var(--spacing-200);
          color: var(--bianco);
          border-top-right-radius: var(--br-400);
          border-top-left-radius: var(--br-400);
        }
        section {
          border: 1px solid var(--main-color);
          border-top: none;
          padding: var(--spacing-300);
        }
        img {
          width: 2em;
        }
        span {
          font-weight: 600;
          font-size: var(--font-size-300);
          margin-left: var(--spacing-200);
        }
      </style>
      <header>
        <img />
        <span></span>
      </header>
      <section>
        <slot></slot>
      </section>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      img: this.shadowRoot.querySelector('img'),
      type: this.shadowRoot.querySelector('span')
    };
    this.addEventListener('change', this.handleChange.bind(this));
  }

  handleChange(e) {
    this.dispatchEvent(
      new Event('item-change', {
        bubbles: true
      })
    );
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
