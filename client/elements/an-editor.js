import buildShadowRoot from './buildShadowRoot.js';
import {downline, down, upline, up} from '../utils/formattedText.js';
import debounce from '../utils/debounce.js';
import {sendComponent} from '../utils/services.js';

class AnEditor extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block;
        }
        * {
          box-sizing: border-box;
        }
        :host([color="dark"]) textarea{
          background: var(--nero-50);
          border: var(--border);
        }
        section {
          display: flex;
          justify-content: space-between;
        }
        section > * {
          width: 100%;
          padding: var(--spacing-200);
        }
        section > div > *:first-child {
          margin-top: 0;
          padding-top: 0;
        }
        textarea {
          font: inherit;
        }
      </style>
      <section>
        <textarea></textarea>
        <div></div>
      </section>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      input: this.shadowRoot.querySelector('textarea'),
      output: this.shadowRoot.querySelector('div')
    };
    this.output = {};
    this.debouncedSend = debounce(this.send, 500).bind(this);
    this.elems.input.addEventListener('keyup', this.debouncedSend);
    this.elems.input.addEventListener('change', this.send.bind(this));
    this.pause = false;
  }

  async handleText() {
    let u, d;
    if (this.type === 'inline') {
      u = upline;
      d = downline;
    } else {
      u = up;
      d = down;
    }
    const markdown = await u(this.elems.input.value);
    this.output.markdown = markdown;
    this.elems.input.value = markdown;
    const html = await d(markdown);
    this.output.html = html;
    this.elems.output.innerHTML = html;
  }

  async send() {
    await this.handleText();
    this.pause = true;
    this.dispatchEvent(
      new Event('change', {
        bubbles: true
      })
    );
  }

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'value':
        if (!this.pause) {
          this.elems.input.value = newVal;
          this.handleText();
        }
        this.pause = false;
        break;
      default:
        break;
    }
  }

  get value() {
    return this.getAttribute('value');
  }
  set value(val) {
    if (val) {
      this.setAttribute('value', val);
    } else {
      this.removeAttribute('value');
    }
  }

  get type() {
    return this.getAttribute('type');
  }
  set type(val) {
    if (val) {
      this.setAttribute('type', val);
    } else {
      this.removeAttribute('type');
    }
  }
}

customElements.define('an-editor', AnEditor);
export default AnEditor;
