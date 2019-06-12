import buildShadowRoot from './buildShadowRoot.js';
class NavItem extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          --color: var(--nero, inherit);
          --color-hover: var(--nero, inherit);
          --underline: var(--link-color, blue);
          margin: var(--spacing-300);
        }
        a {
          color: var(--color);
          text-decoration: none;
          border-bottom: 1px solid transparent;
        }
        a:hover {
          color: var(--color-hover);
          border-bottom: 1px solid var(--underline);
        }
      </style>
      <a href=""><slot></slot></a>
    `;
    buildShadowRoot(html, this);
    this.link = this.shadowRoot.querySelector('a');
  }

  static get observedAttributes() {
    return ['href'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'href') {
      this.link.setAttribute('href', newVal);
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

customElements.define('nav-item', NavItem);
export default NavItem;
