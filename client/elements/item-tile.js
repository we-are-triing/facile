import buildShadowRoot from './buildShadowRoot.js';

class ItemTile extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          display: block;
        }
        a {
          display: block;
          color: var(--nero);
          text-decoration: none;
          font-size: var(--font-size-300);
        }
        img {
          width: 100%;
        }
        p {
          margin: var(--spacing-100) 0 var(--spacing-400);
          text-align: center;
        }
      </style>
      <a href>
        <img />
        <p>
          <slot></slot>
        </p>
      </a>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      img: this.shadowRoot.querySelector('img'),
      a: this.shadowRoot.querySelector('a')
    };
  }

  static get observedAttributes() {
    return ['src', 'href'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'src':
        this.elems.img.setAttribute('src', newVal);
        break;
      case 'href':
        this.elems.a.setAttribute('href', newVal);
        break;
      default:
        break;
    }
  }

  get src() {
    return this.getAttribute('src');
  }
  set src(val) {
    if (val) {
      this.setAttribute('src', val);
    } else {
      this.removeAttribute('src');
    }
  }
  get href() {
    return this.getAttribute('href');
  }
  set href(val) {
    if (val) {
      this.setAttribute('href', val);
    } else {
      this.removeAttribute('href');
    }
  }
}

customElements.define('item-tile', ItemTile);
export default ItemTile;
