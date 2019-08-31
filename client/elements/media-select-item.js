import buildShadowRoot from './buildShadowRoot.js';

class MediaSelectItem extends HTMLElement {
  constructor() {
    super();
    const html = /*html*/ `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        img {
          max-width: 100%;
        }
      </style>
      <img />
      <slot></slot>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      img: this.shadowRoot.querySelector('img')
    };
  }

  static get observedAttributes() {
    return ['src'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'src':
        this.elems.img.setAttribute('src', newVal);
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
  get filename() {
    return this.getAttribute('filename');
  }
  set filename(val) {
    if (val) {
      this.setAttribute('filename', val);
    } else {
      this.removeAttribute('filename');
    }
  }
}

customElements.define('media-select-item', MediaSelectItem);
export default MediaSelectItem;
