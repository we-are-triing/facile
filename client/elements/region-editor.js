import buildShadowRoot from './buildShadowRoot.js';

class RegionEditor extends HTMLElement {
  constructor() {
    super();
    const html = /*html*/ `
      <style>
        :host {
        }
      </style>
      <labeled-select no-label>
        <option></option>
      </labeled-select>
      <slot></slot>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      types: this.shadowRoot.querySelector('labeled-select')
    };

    if (stiva) {
      stiva.listen('components', ({type, icon, tags}) => {});
      stiva.dispatch('components');
      stiva.listen('regions', data => {
        const keys = Object.keys(data);
        this.elems.types.innerHTML = keys.map(type => `<option value="${type}">${data[type].label}</option>`).join('');
        if (!this.type) {
          this.type = keys[0];
        }
      });
      stiva.dispatch('regions');
    }

    this.elems.types.addEventListener('change', this.typeChange.bind(this));
  }

  typeChange(e) {
    this.type = e.target.value;
  }

  static get observedAttributes() {
    return ['type'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'type':
        break;
      default:
        break;
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

customElements.define('region-editor', RegionEditor);
export default RegionEditor;
