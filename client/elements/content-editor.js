import buildShadowRoot from './buildShadowRoot.js';
import {sendContent, deleteContent} from '../utils/services.js';
import './content-header.js';
import './form-boolean.js';
import './form-list.js';
import './form-number.js';
import './form-object.js';
import './form-region.js';
import './form-set.js';
import './form-string.js';
import './form-text.js';
import './form-text-block.js';
import './form-path.js';

class ContentEditor extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block;
        }
        section {
          padding: var(--spacing-300);
        }
      </style>
      <section>
        <content-header></content-header>
        <slot></slot>
      </section>
      <styled-button class="delete" destructive></styled-button>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      header: this.shadowRoot.querySelector('content-header'),
      delete: this.shadowRoot.querySelector('styled-button')
    };
    this.addEventListener('region-change', this.handleChange.bind(this));
    this.addEventListener('change', this.handleChange.bind(this));
    this.elems.header.addEventListener('save', this.handleSave.bind(this));
    this.elems.header.addEventListener('header-change', this.handleChange.bind(this));
    this.elems.delete.addEventListener('click', this.handleDelete.bind(this));
  }

  handleChange(e) {
    this.name = this.elems.header.name;
    this.path = this.elems.header.path;
    this.menu = this.elems.header.menu;
    this.tags = this.elems.header.tags;
    this.publishDate = this.elems.header.publishDate;
    this.send();
  }

  async handleSave() {
    await this.send(true);
    window.location = `/content/${this.name}`;
  }

  async handleDelete() {
    await deleteContent(this.name);
    window.location = `/content`;
  }

  buildData(elem) {
    const obj = this.getItems(elem);
    obj.meta = {
      name: this.name,
      type: this.type,
      path: this.path ? this.path.split('/') : [],
      menu: this.menu ? this.menu.split('/') : [],
      tags: this.tags ? this.tags.split(',') : [],
      publish_date: this.publishDate || 0,
      approvals: {}
    };

    return obj;
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
      (a, n, i, arr) => {
        if (n.localName === 'form-region') {
          a.regions.push(this.getRegions(n));
          return a;
        } else if (i === arr.length - 1 && a.regions.length === 0) {
          delete a.regions;
        }
        let name = n.textContent;
        if (n.localName === `form-set`) {
          name = n.label;
        }
        if (n.localName === 'region-item') {
          a.meta.icon = n.icon;
        }
        a.values[name] = n.value ? n.value.toString() : '';
        return a;
      },
      {meta: {type: elem.type}, regions: [], values: {}}
    );
  }

  async send(force = false) {
    if (this.name && (!this.new || force)) {
      await sendContent(this.buildData(this));
    }
  }

  static get observedAttributes() {
    return ['name-label', 'path-label', 'delete-label', 'menu-label', 'tags-label', 'publish-date-label', 'new', 'name', 'path', 'menu', 'tags', 'publish-date'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'name-label':
        this.elems.header.setAttribute('name-label', newVal);
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
      case 'publish-date-label':
        this.elems.header.setAttribute('publish-date-label', newVal);
        break;
      case 'delete-label':
        this.elems.delete.textContent = newVal;
        break;
      case 'name':
        this.elems.header.name = newVal;
        break;
      case 'path':
        this.elems.header.path = newVal;
        break;
      case 'menu':
        this.elems.header.menu = newVal;
        break;
      case 'tags':
        this.elems.header.tags = newVal;
        break;
      case 'publish-date':
        this.elems.header.publishDate = newVal;
        break;
      case 'new':
        this.elems.header.setAttribute('new', newVal);
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
  get deleteLabel() {
    return this.getAttribute('delete-label');
  }
  set deleteLabel(val) {
    if (val) {
      this.setAttribute('delete-label', val);
    } else {
      this.removeAttribute('delete-label');
    }
  }
  get publishDateLabel() {
    return this.getAttribute('publish-date-label');
  }
  set publishDateLabel(val) {
    if (val) {
      this.setAttribute('publish-date-label', val);
    } else {
      this.removeAttribute('publish-date-label');
    }
  }

  get new() {
    return this.hasAttribute('new');
  }
  set new(val) {
    if (val) {
      this.setAttribute('new', '');
    } else {
      this.removeAttribute('new');
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
  get name() {
    return this.getAttribute('name');
  }
  set name(val) {
    if (val) {
      this.setAttribute('name', val);
    } else {
      this.removeAttribute('name');
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
  get menu() {
    return this.getAttribute('menu');
  }
  set menu(val) {
    if (val) {
      this.setAttribute('menu', val);
    } else {
      this.removeAttribute('menu');
    }
  }
  get tags() {
    return this.getAttribute('tags');
  }
  set tags(val) {
    if (val) {
      this.setAttribute('tags', val);
    } else {
      this.removeAttribute('tags');
    }
  }
  get publishDate() {
    return this.getAttribute('publish-date');
  }
  set publishDate(val) {
    if (val) {
      this.setAttribute('publish-date', val);
    } else {
      this.removeAttribute('publish-date');
    }
  }
}

customElements.define('content-editor', ContentEditor);
export default ContentEditor;
