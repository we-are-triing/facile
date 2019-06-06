import buildShadowRoot from './buildShadowRoot.js';
class TileList extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          display: block;
          margin: var(--spacing-600) 0;
        }
        ::slotted(*:not(item-tile)) {
          display: none;
        }
        section {
          --layout: 1fr;
          display: grid;
          grid-template-columns: var(--layout);
          grid-gap: var(--spacing-500);
        }
        h2 {
          font-size: var(--font-size-600);
          margin-bottom: var(--spacing-100);
        }
        p {
          margin: 0 0 var(--spacing-400);
        }
        a {
          display: block;
          color: var(--main);
          text-decoration: none;
          font-weight: 700;
          font-size: var(--font-size-300);
          text-align: right;
        }
        a:hover {
          text-decoration: underline;
        }
        /* TODO: remove this as an @media in favor of a prop. */
        @media screen and (min-width: 36em){
          section {
            --layout: 1fr 1fr;
          }
        }
        @media screen and (min-width: 62em){ 
          section {
            --layout: 1fr 1fr 1fr;
          }
        }
      </style>
      <h2></h2>
      <p></p>
      <section>
        <slot></slot>
      </section>
      <a></a>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      title: this.shadowRoot.querySelector(`h2`),
      description: this.shadowRoot.querySelector(`p`),
      cta: this.shadowRoot.querySelector(`a`)
    };
  }

  static get observedAttributes() {
    return [`title`, `description`, `cta`, `href`];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case `title`:
        this.elems.title.textContent = newVal;
        break;
      case `description`:
        this.elems.description.textContent = newVal;
        break;
      case `cta`:
        this.elems.cta.textContent = newVal;
        break;
      case `href`:
        this.elems.cta.href = newVal;
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
  get description() {
    return this.getAttribute(`description`);
  }
  set description(val) {
    if (val) {
      this.setAttribute(`description`, val);
    } else {
      this.removeAttribute(`description`);
    }
  }
  get cta() {
    return this.getAttribute(`cta`);
  }
  set cta(val) {
    if (val) {
      this.setAttribute(`cta`, val);
    } else {
      this.removeAttribute(`cta`);
    }
  }
  get href() {
    return this.getAttribute(`href`);
  }
  set href(val) {
    if (val) {
      this.setAttribute(`href`, val);
    } else {
      this.removeAttribute(`href`);
    }
  }
}

customElements.define(`tile-list`, TileList);
export default TileList;
