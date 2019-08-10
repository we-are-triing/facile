import buildShadowRoot from './buildShadowRoot.js';
import './an-icon.js';
import './labeled-input.js';

class FilterList extends HTMLElement {
  constructor() {
    super();
    const html = /*html*/ `
      <style>
        :host {
          --color: var(--nero-100);
          
          background: var(--color);
          display: grid;
          grid-template-rows: 3.4em 4em 1fr; 
        }

        :host([full]){
          height: 100%;
          width: 100%;
        }

        :host([list]) .grid slot {
          display: block;
        }
        
        * {
          box-sizing: border-box;
        }
        .title {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--main);
          font-size: var(--font-size-600);
          font-weight: 900;
          color: var(--bianco);
          padding: var(--spacing-200);
        }
        .grid slot {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          padding: var(--spacing-400);
          max-height: 100%;
          overflow: auto;
        }
        .filters {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: space-between;
          padding: var(--spacing-300);
          font-size: var(--font-size-400);
        }
        .filters an-icon {
          font-size: var(--font-size-700);
        }
        labeled-input {
          width: calc(100% - 2.6em);
        }
        ::slotted(*){
          display: none;
        }
        ::slotted(nav-item),
        ::slotted(nav-folder) {
          display: block;
        }
        ::slotted(item-tile) {
          display: block;
          width: 47%;
        }
      </style>
      <span class="title"></span>
      <section class="filters">
        <labeled-input class="search" type="search" no-label></labeled-input>
        <an-icon type="settings"></an-icon>
      </section>
      <section class="grid">
        <slot></slot>
      </section>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      search: this.shadowRoot.querySelector('.search'),
      title: this.shadowRoot.querySelector('.title')
    };
  }

  static get observedAttributes() {
    return ['section-title', 'placeholder'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'section-title':
        this.elems.title.textContent = newVal;
        break;
      case 'placeholder':
        this.elems.search.placeholder = newVal;
        this.elems.search.textContent = newVal;
        break;
      default:
        break;
    }
  }

  get sectionTitle() {
    return this.getAttribute('section-title');
  }
  set sectionTitle(val) {
    if (val) {
      this.setAttribute('section-title', val);
    } else {
      this.removeAttribute('section-title');
    }
  }
  get placeholder() {
    return this.getAttribute('placeholder');
  }
  set placeholder(val) {
    if (val) {
      this.setAttribute('placeholder', val);
    } else {
      this.removeAttribute('placeholder');
    }
  }
}

customElements.define('filter-list', FilterList);
export default FilterList;
