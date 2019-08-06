import buildShadowRoot from './buildShadowRoot.js';
import {downline, down} from '../utils/formattedText.js';
import debounce from '../utils/debounce.js';

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
    const debouncedHandleText = debounce(this.handleText).bind(this);
    this.elems.input.addEventListener('keyup', debouncedHandleText);
    //this.elems.input.addEventListener('keyup', this.handleText.bind(this));
  }
  // TODO: this will eventually be replaced with a WYSIWYG editor with markdown as it's engine,
  // It will not allow markup.
  // But we need a simple version to begin with.
  async handleText(e) {
    // TODO: Why is the debounce altering the returned event object from the input to this?
    this.output = await this.parse(this.elems.input.value);
    this.elems.output.innerHTML = this.output;
  }

  parse(val) {
    if (this.type === 'inline') {
      return downline(val);
    }
    return down(val);
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
