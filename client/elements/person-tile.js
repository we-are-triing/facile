import buildShadowRoot from './buildShadowRoot.js';
class PersonTile extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          display: flex;
          align-items: flex-start;
          margin-bottom: var(--spacing-500);
          flex-direction: column;
          margin: var(--spacing-400);
        }
        img {
          border-radius: 50%;
          height: 160px;
          margin-right: var(--spacing-500);
        }
        h1 {
          margin: var(--spacing-400) 0;
          font-size: var(--font-size-850);
          font-weight: 300;
          line-height: var(--lh-25);
          font-family: var(--serif);
        }
        h1 span {
            font-size: 0.38em;
            display: block;
            line-height: 1;
            margin-left: 0.1em;
        }

        @media (min-width: 43em) {
          :host {
            display: flex;
            align-items: center;
            margin-bottom: var(--spacing-500);
            flex-direction: row;
          }
          header {
              display: flex;
              align-items: center;
              margin-bottom: var(--spacing-500);
              flex-direction: row;
          }
          h1 {
              font-size: var(--font-size-900);
              margin-top: 0;
          }
        }
      </style>
      
        <img />
        <h1>
          <span>Hello, I'm</span> 
          <slot></slot>
        </h1>
        
      
    `;
    buildShadowRoot(html, this);
    this.img = this.shadowRoot.querySelector(`img`);
  }

  static get observedAttributes() {
    return [`src`];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === `src`) {
      this.img.src = newVal;
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
}

customElements.define(`person-tile`, PersonTile);
export default PersonTile;
