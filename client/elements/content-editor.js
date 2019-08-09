import buildShadowRoot from './buildShadowRoot.js';
import getChildren from '../utils/selectDirectChildren.js';
import './content-header.js';

class ContentEditor extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
        }
      </style>
      <content-header></content-header>
      <slot></slot>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      header: this.shadowRoot.querySelector('content-header')
    };
    this.addEventListener('region-change', this.handleChange.bind(this));
  }

  handleChange(e) {
    this.buildData(this);
  }

  buildData(elem) {
    const regions = [...elem.children].map(child => this.getRegions(child));
    console.log(regions);
  }

  getRegions(elem) {
    return {
      meta: {
        name: elem.name
      },
      regions: [...elem.children].map(item => this.getItems(item))
    };
  }

  getItems(elem) {
    return [...elem.children].reduce(
      (a, n) => {
        if (n.localName === 'form-region') {
          a.regions.push(this.getRegions(n));
          return a;
        }
        a.values[n.textContent] = n.value ? n.value.toString() : '';
        return a;
      },
      {meta: {type: elem.type}, regions: [], values: {}}
    );
  }

  static get observedAttributes() {
    return ['name-label', 'slug-label', 'path-label', 'menu-label', 'tags-label'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'name-label':
        this.elems.header.setAttribute('name-label', newVal);
        break;
      case 'slug-label':
        this.elems.header.setAttribute('slug-label', newVal);
        break;
      case 'path-label':
        this.elems.header.setAttribute('path-label', newVal);
        break;
      case 'menu-label':
        this.elems.header.setAttribute('menu-label', newVal);
        break;
      case 'tags-label':
        this.elems.header.setAttribute('tags-label', newVal);
        break;
      default:
        break;
    }
  }

  get nameLabel() {
    return this.getAttribute('name-label');
  }
  set nameLabel(val) {
    if (val) {
      this.setAttribute('name-label', val);
    } else {
      this.removeAttribute('name-label');
    }
  }
  get slugLabel() {
    return this.getAttribute('slug-label');
  }
  set slugLabel(val) {
    if (val) {
      this.setAttribute('slug-label', val);
    } else {
      this.removeAttribute('slug-label');
    }
  }
  get pathLabel() {
    return this.getAttribute('path-label');
  }
  set pathLabel(val) {
    if (val) {
      this.setAttribute('path-label', val);
    } else {
      this.removeAttribute('path-label');
    }
  }
  get menuLabel() {
    return this.getAttribute('menu-label');
  }
  set menuLabel(val) {
    if (val) {
      this.setAttribute('menu-label', val);
    } else {
      this.removeAttribute('menu-label');
    }
  }
  get tagsLabel() {
    return this.getAttribute('tags-label');
  }
  set tagsLabel(val) {
    if (val) {
      this.setAttribute('tags-label', val);
    } else {
      this.removeAttribute('tags-label');
    }
  }
}

customElements.define('content-editor', ContentEditor);
export default ContentEditor;
