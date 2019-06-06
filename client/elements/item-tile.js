import buildShadowRoot from './buildShadowRoot.js';
class ItemTile extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          display: block;
          padding-bottom: var(--spacing-500);
        }
        a {
          display: block;
          height: 100%;
          width: 100%;
          
          color: var(--black);
          text-decoration: none;
          line-height: var(--lh-200);
        }
        span {
          display: block;
          font-size: var(--font-size-600);
          font-weight: 500;
          margin: var(--spacing-200) 0 var(--spacing-100);
        }
        .hide {
          display: none;
        }
        .placeholder {
          padding: var(--spacing-100);
          background: var(--main-t);
          width: 30%;
        }
        img {
          width: 100%;
        }
        :host([type="circle"]) {
          text-align: center;
        }
        :host([type="circle"]) img {
          border-radius: 50%;
        }
      </style>
      <a>
        <img class="hide" />
        <aside class="placeholder"></aside>
        <span></span>
        <slot></slot>
      </a>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      card: this.shadowRoot.querySelector(`a`),
      title: this.shadowRoot.querySelector(`span`),
      placeholder: this.shadowRoot.querySelector(`.placeholder`),
      img: this.shadowRoot.querySelector(`img`)
    };
  }

  static get observedAttributes() {
    return [`title`, `link`, `src`];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case `title`:
        this.elems.title.textContent = newVal;
        break;
      case `src`:
        this.elems.img.classList.toggle('hide', !newVal);
        this.elems.placeholder.classList.toggle('hide', newVal);
        this.elems.img.src = newVal;
        break;
      case `link`:
        this.elems.card.href = newVal;
        break;
      default:
        break;
    }
  }

  get title() {
    return this.getAttribute(`title`);
  }
  set title(val) {
    if (val) {
      this.setAttribute(`title`, val);
    } else {
      this.removeAttribute(`title`);
    }
  }
  get src() {
    return this.getAttribute(`src`);
  }
  set src(val) {
    if (val) {
      this.setAttribute(`src`, val);
    } else {
      this.removeAttribute(`src`);
    }
  }
  get link() {
    return this.getAttribute(`link`);
  }
  set link(val) {
    if (val) {
      this.setAttribute(`link`, val);
    } else {
      this.removeAttribute(`link`);
    }
  }
  get type() {
    return this.getAttribute(`type`);
  }
  set type(val) {
    if (val) {
      this.setAttribute(`type`, val);
    } else {
      this.removeAttribute(`type`);
    }
  }
}

customElements.define(`item-tile`, ItemTile);
export default ItemTile;
