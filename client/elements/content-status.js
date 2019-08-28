import buildShadowRoot from './buildShadowRoot.js';

class ContentStatus extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          --draft: var(--rosso-500);
          --scheduled: var(--azzurro-300);
          --published: var(--verde-500);
          --status: var(--draft);
          display: flex;
          align-items: center;
          font-size: var(--font-size-300);
          margin: var(--spacing-100);
        }
        .dot {
          display: block;
          height: 1em;
          width: 1em;
          background: var(--status);
          border-radius: 50%;
          margin-right: var(--spacing-100);
        }
        :host([status="scheduled"]){
          --status: var(--scheduled);
        }
        :host([status="published"]){
          --status: var(--published);
        }
        :host([align="right"]){
          justify-content: flex-end;
        }
      </style>
      <span class="dot"></span>
      <span class="label">Draft</span>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      dot: this.shadowRoot.querySelector('.dot'),
      label: this.shadowRoot.querySelector('.label')
    };
  }

  static get observedAttributes() {
    return ['status'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'status':
        // TODO: iternationalize this.
        this.elems.label.textContent = newVal;
        break;
      default:
        break;
    }
  }

  get status() {
    return this.getAttribute('status');
  }
  set status(val) {
    if (val) {
      this.setAttribute('status', val);
    } else {
      this.removeAttribute('status');
    }
  }
  get align() {
    return this.getAttribute('align');
  }
  set align(val) {
    if (val) {
      this.setAttribute('align', val);
    } else {
      this.removeAttribute('align');
    }
  }
}

customElements.define('content-status', ContentStatus);
export default ContentStatus;
