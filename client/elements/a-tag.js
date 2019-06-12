import buildShadowRoot from './buildShadowRoot.js';
import './an-icon.js';

class ATag extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          --bg: var(--main);
          --color: var(--bianco);
          display: inline-block;
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

        an-icon {
          margin-left: var(--spacing-200);
          cursor: pointer;
        }
      </style>
      <section>
        <slot></slot>
        <an-icon type="close"></an-icon>
      </section>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      delete: this.shadowRoot.querySelector('an-icon')
    };
    this.elems.delete.addEventListener('click', this.handleDelete.bind(this));
  }
  handleDelete(e) {
    this.dispatchEvent(
      new CustomEvent('delete', {
        bubbles: true,
        detail: {
          tag: this.textContent
        }
      })
    );
  }
}

customElements.define('a-tag', ATag);
export default ATag;
