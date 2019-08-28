import buildShadowRoot from './buildShadowRoot.js';
import './a-tag.js';

class TagList extends HTMLElement {
  constructor() {
    super();
    const html = /*html*/ `
      <style>
        :host {
          display: block;
          margin-top: var(--spacing-300);
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
          align-items: center;
        }
        span {
          font-weight: 600;
          font-size: var(--font-size-300);
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

  handleTagChange(e) {
    e.stopPropagation();
    const {type, tag} = e.detail;

    if (type === 'remove') {
      [...this.children].forEach(node => node.textContent === tag && node.remove());
    } else {
      const elem = document.createElement('a-tag');
      elem.textContent = tag;
      this.appendChild(elem);
    }

    this.dispatchEvent(
      new CustomEvent('tag-update', {
        bubbles: true,
        detail: {
          tags: [...this.children].map(child => child.textContent).join(',')
        }
      })
    );
  }

  static get observedAttributes() {
    return ['label', 'add-label'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'label':
        this.elems.label.textContent = newVal;
        break;
      case 'add-label':
        this.elems.add.setAttribute('add-label', newVal);
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

  get addLabel() {
    return this.hasAttribute('add-label');
  }
  set addLabel(val) {
    if (val) {
      this.setAttribute('add-label', '');
    } else {
      this.removeAttribute('add-label');
    }
  }
}

customElements.define('tag-list', TagList);
export default TagList;
