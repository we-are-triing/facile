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
        }
        .dot {
          display: block;
          height: 0.8em;
          width: 0.8em;
          background: var(--status);
          border-radius: 50%;
        }
        :host([status="scheduled"]){
          --status: var(--scheduled);
        }
        :host([status="published"]){
          --status: var(--published);
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
}

customElements.define('content-status', ContentStatus);
export default ContentStatus;
