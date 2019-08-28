import buildShadowRoot from './buildShadowRoot.js';

class LabeledSelect extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block;
        }
        :host([no-label]) label{
          display: none;
        }
        * {
          box-sizing: border-box;
        }
        :host([large]) select{
          border: none;
          border-bottom: var(--border);
          font-size: 2em;
          border-radius: 0;
        }
        label {
          font-weight: 600;
          font-size: var(--font-size-300);
          margin-top: var(--spacing-400);
        }
        select {
          font-size: inherit;
          padding: var(--spacing-100) var(--spacing-200);
          font-family: inherit;
          border: var(--border);
          border-radius: var(--br-400);
          font-weight: 100;
          color: inherit;
          width: 100%;
          background: var(--nero-50);
        }
        select::placeholder {
          color: var(--nero-300);
        }
      </style>
      <label for="input"></label>
      <select name="input"></select>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      select: this.shadowRoot.querySelector('select'),
      label: this.shadowRoot.querySelector('label')
    };
    this.observer = this.watchChildren();
    this.updateChildren();
    this.elems.select.addEventListener('change', this.handleChange.bind(this));
  }

  handleChange(e) {
    this.value = this.elems.select.value;
    this.selectedIndex = this.elems.select.selectedIndex;
    this.dispatchEvent(
      new Event('change', {
        bubbles: true
      })
    );
  }

  watchChildren() {
    return new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        this.updateChildren();
      });
    });
  }

  updateChildren() {
    this.observer.disconnect();

    [...this.elems.select.children].forEach(child => child.remove());

    [...this.children].forEach((child, i) => {
      if (i === 0) {
        this.value = child.value || child.textContent;
      }
      if (child.localName === 'option') {
        this.elems.select.appendChild(child.cloneNode(true));
      }
    });

    this.observer.observe(this, {childList: true});
  }

  static get observedAttributes() {
    return ['value', 'label', 'selected-index'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'placeholder':
        this.elems.select.setAttribute('placeholder', newVal);
        break;
      case 'value':
        this.elems.select.value = newVal;
        break;
      case 'label':
        this.elems.label.textContent = newVal;
        break;
      case 'selected-index':
        this.elems.select.selectedIndex = newVal;
        this.value = this.elems.select.value;
        break;
      default:
        break;
    }
  }

  get selectedIndex() {
    return this.getAttribute('selected-index');
  }
  set selectedIndex(val) {
    if (val) {
      this.setAttribute('selected-index', val);
    } else {
      this.removeAttribute('selected-index');
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

  get placeholder() {
    return this.getAttribute('placeholder');
  }
  set placeholder(val) {
    if (val) {
      this.setAttribute('placeholder', val);
    } else {
      this.removeAttribute('placeholder');
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
}

customElements.define('labeled-select', LabeledSelect);
export default LabeledSelect;
