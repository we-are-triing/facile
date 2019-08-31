import buildShadowRoot from './buildShadowRoot.js';
import {queryMedia} from '../utils/services.js';
import './media-select-item.js';

class MediaSelect extends HTMLElement {
  constructor() {
    super();
    const html = /*html*/ `
      <style>
        :host {
          display: block;
        }
        section { 
          display: flex;
          flex-wrap: wrap;
        }
        media-select-item {
          flex-basis: 25%;
        }
      </style>
      <labeled-input no-label></labeled-input>
      <section class="list"></section>

    `;
    buildShadowRoot(html, this);
    this.elems = {
      input: this.shadowRoot.querySelector('labeled-input'),
      list: this.shadowRoot.querySelector('.list')
    };
    this.elems.input.addEventListener('change', this.handleQuery.bind(this));
    this.elems.list.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick(e) {
    if (e.target.localName === 'media-select-item') {
      this.filename = e.target.filename;
      this.path = e.target.src;
      this.dispatchEvent(
        new Event('selected', {
          bubbles: true
        })
      );
    }
  }

  async handleQuery(e) {
    const results = await queryMedia(this.elems.input.value);
    this.query = this.elems.input.value;
    this.elems.list.innerHTML = '';
    results.forEach(item => {
      const elem = document.createElement('media-select-item');
      elem.filename = item.filename;
      elem.src = item.path;
      elem.textContent = item.name;
      this.elems.list.appendChild(elem);
    });
  }

  static get observedAttributes() {
    return ['query'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'query':
        this.elems.input.value = newVal;
        break;
      default:
        break;
    }
  }

  get query() {
    return this.getAttribute('query');
  }
  set query(val) {
    if (val) {
      this.setAttribute('query', val);
    } else {
      this.removeAttribute('query');
    }
  }
  get filename() {
    return this.getAttribute('filename');
  }
  set filename(val) {
    if (val) {
      this.setAttribute('filename', val);
    } else {
      this.removeAttribute('filename');
    }
  }
  get path() {
    return this.getAttribute('path');
  }
  set path(val) {
    if (val) {
      this.setAttribute('path', val);
    } else {
      this.removeAttribute('path');
    }
  }
}

customElements.define('media-select', MediaSelect);
export default MediaSelect;
