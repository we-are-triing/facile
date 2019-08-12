import buildShadowRoot from './buildShadowRoot.js';

class CheckBox extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
        <style>
          :host {
            display: inline-block;
            --background: var(--white, #fff);
          }
          * {
            box-sizing: border-box;
          }
          div {
            position: relative;
            width: 100%;
          }
          input {
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
          }
          label {
            display: inline-block;
            width: 100%;
            position: relative;
            z-index: 10;
            padding: var(--spacing-200);
            text-align: center;
            background: var(--background);
            border: var(--border);
            border-radius: var(--br-400);
            cursor: pointer;
          }
          :host([checked]) label {
            --background: var(--main);
            color: var(--white);
          }
        </style>
        <div>
          <label for="check"><slot></slot></label>
          <input id="check" type="checkbox" />
        </div>
    `;

    buildShadowRoot(html, this);

    this.elems = {
      input: this.shadowRoot.querySelector('input')
    };

    this.elems.input.addEventListener('change', this.handleChange.bind(this));
  }

  // static get observedAttributes() {
  //   return [`checked`];
  // }

  // attributeChangedCallback(attrName, oldVal, newVal) {
  //   if (attrName === `checked`) {
  //     // this.elems.input.checked = !!newVal;
  //   }
  // }

  get checked() {
    return this.hasAttribute(`checked`);
  }
  set checked(val) {
    if (val) this.setAttribute(`checked`, '');
    else this.removeAttribute(`checked`);
  }

  handleChange(e) {
    e.stopPropagation();
    this.checked = e.target.checked;
    this.dispatchEvent(new Event('change'), {
      bubbles: true,
      cancelable: true
    });
  }
}

customElements.define('check-box', CheckBox);
export default CheckBox;
