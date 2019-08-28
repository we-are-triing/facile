import buildShadowRoot from './buildShadowRoot.js';

class ItemTile extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block;
          position: relative;
        }

        :host([type="small"]) a {
          padding: var(--spacing-500);
        }
        :host([type="small"]) p {
          margin: var(--spacing-100) 0;
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
        an-icon { 
          display: none;
          position: absolute;
          cursor: pointer;
          right: 0;
          top: 0;
        }
        :host([closeable]) an-icon {
          display: block;
        }
      </style>
      <a href>
        <img />
        <p>
          <slot></slot>
        </p>
      </a>
      <an-icon type="close"></an-icon>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      img: this.shadowRoot.querySelector('img'),
      a: this.shadowRoot.querySelector('a'),
      close: this.shadowRoot.querySelector('an-icon')
    };
    this.elems.close.addEventListener('click', this.handleClose.bind(this));
  }

  handleClose(e) {
    e.stopPropagation();
    e.preventDefault();
    this.dispatchEvent(
      new Event('close', {
        bubbles: true
      })
    );
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
  get closeable() {
    return this.getAttribute('closeable');
  }
  set closeable(val) {
    if (val) {
      this.setAttribute('closeable', val);
    } else {
      this.removeAttribute('closeable');
    }
  }
}

customElements.define('item-tile', ItemTile);
export default ItemTile;
