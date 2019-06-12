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
          flex-direction: column;
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
          <a-tag add></a-tag>
        </div>
      </div>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      label: this.shadowRoot.querySelector('span'),
      add: this.shadowRoot.querySelector('a-tag')
    };
    this.addEventListener('change', this.handleTagChange.bind(this));
    this.elems.add.addEventListener('change', this.handleTagChange.bind(this));
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

  handleTagChange({detail}) {
    const {type, tag} = detail;

    if (type === 'remove') {
      [...this.childNodes].forEach(node => node.textContent === tag && node.remove());
    } else {
      const elem = document.createElement('a-tag');
      elem.textContent = tag;
      this.appendChild(elem);
    }
    //TODO: send this back to the server.
  }
}

customElements.define('tag-list', TagList);
export default TagList;
