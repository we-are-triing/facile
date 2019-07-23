import buildShadowRoot from './buildShadowRoot.js';
import './an-icon.js';
class NavItem extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          --color: var(--nero, inherit);
          --color-hover: var(--nero, inherit);
          --underline: var(--link-color, blue);
          margin: var(--spacing-300);
        }
        :host([folder]),
        :host([add]),
        :host([item]) {
          display: block;
          border-bottom: 1px solid var(--nero-300);
          margin: 0;
        }
        :host([folder]:first-child),
        :host([add]:first-child),
        :host([item]:first-child) {
          border-top: 1px solid var(--nero-300);
        }

        :host([item]) a,
        :host([folder]) a,
        :host([add]) a {
          display: block;
          padding: var(--spacing-300);
        }
        
        :host([item]) a:hover,
        :host([folder]) a:hover,
        :host([add]) a:hover {
          border-bottom: 1px solid transparent;
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
        an-icon {
          display: none;
        }
        :host([add]) an-icon[type="add"] {
          display: inline-block;
        }
        :host([folder]) an-icon[type="arrow"] {
          display: inline-block;
        }
      </style>
      <!-- TODO: add icon based on item, folder, and add -->
      <a href="">
        <slot></slot>
        <an-icon type="add"></an-icon>
        <an-icon type="arrow"></an-icon>
      </a>
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
