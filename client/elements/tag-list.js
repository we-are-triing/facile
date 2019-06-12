import buildShadowRoot from './buildShadowRoot.js';

class TagList extends HTMLElement {
  constructor() {
    super();
    const html = /*html*/ `
      <style>
        :host {
          display: block;
        }
        .container {
          display: flex;
        }
        span {
          margin-right: var(--spacing-200);
        }
        ::slotted(*){
          display: none;
        }
        ::slotted(a-tag){
          display: inline-block;
          margin: var(--spacing-100);
        }
        .container div {
          display: flex;
          flex-wrap: wrap;
        }
      </style>
      <div class="container">
        <span></span>
        <div>
          <slot></slot>
        </div>
      </div>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      label: this.shadowRoot.querySelector('span')
    };
    this.addEventListener('delete', this.handleTagChange.bind(this));
  }

  static get observedAttributes() {
    return ['label'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'label':
        this.elems.label.textContent = newVal;
        break;
      default:
        break;
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

  handleTagChange(e) {
    [...this.childNodes].forEach(tag => tag.textContent === e.detail.tag && tag.remove());
    //TODO: send this back to the server.
  }
}

customElements.define('tag-list', TagList);
export default TagList;
