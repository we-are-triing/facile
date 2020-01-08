import buildShadowRoot from './buildShadowRoot.js';
import './an-icon.js';

class ATag extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          --bg: var(--main);
          --color: var(--bianco);
          display: inline-block;
          font-size: var(--font-size-300);
        }

        section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg);
          color: var(--color);
          font-weight: 700;
          border-radius: var(--br-400);
          margin: 0 var(--spacing-50);
          padding: var(--spacing-100) var(--spacing-100) var(--spacing-100) var(--spacing-200);
        }
        :host([add]) section {
          padding: var(--spacing-50) var(--spacing-100) var(--spacing-50) var(--spacing-200);
        }
        :host([add]) input{
          display: inline;
        }
        input {
          display: none;
          border: none;
          background: transparent;
          color: var(--bianco);
          font-family: inherit;
          font-weight: inherit;
          font-size: inherit;
          width: 5em;
        }
        input::placeholder {
          color: var(--bianco-t);
        }
        an-icon {
          margin-left: var(--spacing-200);
          cursor: pointer;
        }
      </style>
      <section>
        <slot></slot>
        <input type="text" />

        <an-icon type="close"></an-icon>
      </section>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      change: this.shadowRoot.querySelector('an-icon'),
      input: this.shadowRoot.querySelector('input')
    };
    this.elems.change.addEventListener('click', this.handleChange.bind(this));
    this.elems.input.addEventListener('keydown', this.handleEnter.bind(this));
  }

  static get observedAttributes() {
    return ['add', 'add-label'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'add':
        this.elems.change.type = 'add';
        break;
      case 'add-label':
        this.elems.input.setAttribute('placeholder', newVal);
        break;
      default:
        this.elems.change.type = 'close';
        break;
    }
  }

  get add() {
    return this.hasAttribute('add');
  }
  set add(val) {
    if (val) {
      this.setAttribute('add', '');
    } else {
      this.removeAttribute('add');
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

  handleEnter(e) {
    if (e.which === 13) {
      this.handleChange(e);
    }
  }

  handleChange(e) {
    let type, tag;
    if (e.target.type === 'close') {
      type = 'remove';
      tag = this.textContent;
    } else {
      type = 'add';
      tag = this.elems.input.value;
      this.elems.input.value = '';
      if (tag === '') return;
    }

    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        detail: {tag, type}
      })
    );
  }
}

customElements.define('a-tag', ATag);
export default ATag;
