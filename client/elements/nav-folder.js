import buildShadowRoot from './buildShadowRoot.js';
import './an-icon.js';
class NavFolder extends HTMLElement {
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
        :host([vertical]) {
          display: block;
          border-bottom: 1px solid var(--nero-300);
          margin: 0;
        }
        :host([vertical]:first-child) {
          border-top: 1px solid var(--nero-300);
        }

        :host([vertical]) a{
          display: block;
          padding: var(--spacing-300);
        }
        
        :host([vertical]) a:hover {
          border-bottom: 1px solid transparent;
        }

        span {
          color: var(--color);
          text-decoration: none;
          border-bottom: 1px solid transparent;
        }
        span:hover {
          color: var(--color-hover);
          border-bottom: 1px solid var(--underline);
        }
      </style>
      <span></span>
      <an-icon type="arrow"></an-icon>
      <section>
        <slot></slot>
      </section>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      label: this.shadowRoot.querySelector('span')
    };
  }

  static get observedAttributes() {
    return ['label'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'label') {
      this.elems.label.textContent = newVal;
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

customElements.define('nav-folder', NavFolder);
export default NavFolder;
