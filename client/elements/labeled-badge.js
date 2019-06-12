import buildShadowRoot from './buildShadowRoot.js';
class LabeledBadge extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          --label: var(--font-size-300);
          --color: var(--nero-200);

          font-size: var(--font-size-500);
        }

        section {
          display: inline-block;
          text-align: center;
          border: 1px solid var(--color);
          border-radius: var(--br-400);
        }
        
        span:first-child {
          display: block;
          color: var(--nero);
          background: var(--bianco);
          padding: var(--spacing-300);
        }

        span:last-child {
          display: block;
          color: var(--bianco);
          background: var(--color);
          padding: var(--spacing-200);
          font-size: var(--label);
        }
      </style>
      <section>
        <span><slot></slot></span>
        <span></span>
      </section>
      
    `;
    buildShadowRoot(html, this);
    this.elems = {
      label: this.shadowRoot.querySelector(`span:last-child`)
    };
  }

  static get observedAttributes() {
    return [`label`];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === `label`) {
      this.elems.label.textContent = newVal;
    }
  }

  get label() {
    return this.getAttribute(`label`);
  }
  set label(val) {
    if (val) this.setAttribute(`label`, val);
    else this.removeAttribute(`label`);
  }
}

customElements.define('labeled-badge', LabeledBadge);
export default LabeledBadge;
