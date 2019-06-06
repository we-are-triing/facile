import buildShadowRoot from './buildShadowRoot.js';
class StyledButton extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          --color: var(--main, #69f);
          --color-hover: var(--main, #69f);
          --spacing: 1.3em;
          --padding: calc(var(--spacing) / 2) var(--spacing) calc(var(--spacing) / 1.6);
          --font: var(--serif);

          color: var(--white);
          display: inline-block;
          font-size: var(--font-size-700);
          user-select: none;
        }
        a {
          font-family: var(--font);
          background: var(--color);
          border-radius: var(--br-500);
          color: inherit;
          cursor: pointer;
          display: inherit;
          text-decoration: none;
          line-height: var(--lh-50);
          padding: var(--padding);
          text-align: center;
        }
        a:hover {
          --color: var(--color-hover); 
          color: inherit;
        }
        :host([type="sans"]) a {
          --font: var(--sans);
          --spacing: 1em;
          --padding: calc(var(--spacing) / 2) var(--spacing) calc(var(--spacing) / 1.8);
        }
      </style>
      <a><slot></slot></a>
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

customElements.define('styled-button', StyledButton);
export default StyledButton;
