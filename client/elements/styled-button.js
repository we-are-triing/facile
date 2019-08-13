import buildShadowRoot from './buildShadowRoot.js';
class StyledButton extends HTMLElement {
  constructor() {
    super();
    const html = /*html*/ `
      <style>
        :host {
          --color: var(--main, #69f);
          --color-hover: var(--main, #69f);
          --spacing: 1em;
          --padding: calc(var(--spacing) / 2) var(--spacing) calc(var(--spacing) / 1.8);
          
          --font: var(--sans);

          color: var(--bianco);
          display: inline-block;
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
          font-weight: 700;
        }
        a:hover {
          --color: var(--color-hover); 
          color: inherit;
        }
        :host([type="serif"]) a {
          --font: var(--serif);
          --spacing: 1.3em;
          font-weight: 500;
          --padding: calc(var(--spacing) / 2) var(--spacing) calc(var(--spacing) / 1.6);
        }
        :host([destructive]){
          --color: var(--rosso, #69f);
          --color-hover: var(--rosso, #69f);
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
