import buildShadowRoot from './buildShadowRoot.js';
import {sendComponent, deleteComponent, sendMedia, sendTemplate, deleteTemplate} from '../utils/services.js';
import './item-header.js';
import './labeled-select.js';
import './labeled-input.js';
import './item-value.js';
import './styled-button.js';

class ItemEditor extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block;
          box-sizing: border-box;
          max-width: var(--mw-500);
        }
        item-header,
        main {
          margin: var(--spacing-400);
        }
        an-icon {
          cursor: pointer;
          color: var(--main);
          font-size: 2em;
        }
        .new {
          display: flex;
          align-items: center;
          margin: var(--spacing-300) 0;
        }
        .new > * {
          margin-right: var(--spacing-200);
        }
        .new labeled-input {
          margin-top: 0;
        }
        .create {
          display: none;
        }
        :host([new]) .create {
          display: inline-block;
        }
        :host([new]) .delete {
          display: none;
        }
      </style>
      <item-header></item-header>
      <main>
        <slot></slot>
        <section class="new">
          <labeled-input no-label class="new_name"></labeled-input>
          <labeled-select no-label>
            <option></option>
          </labeled-select>
          <an-icon type="add"></an-icon>
        </section>
        <styled-button class="create"></styled-button>
        <styled-button class="delete" destructive></styled-button>
      </main>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      header: this.shadowRoot.querySelector('item-header'),
      name: this.shadowRoot.querySelector('labeled-input'),
      select: this.shadowRoot.querySelector('labeled-select'),
      add: this.shadowRoot.querySelector('an-icon'),
      submit: this.shadowRoot.querySelector('.create'),
      delete: this.shadowRoot.querySelector('.delete')
    };
    if (stiva) {
      stiva.listen('primitives', data => {
        this.elems.select.innerHTML = Object.keys(data)
          .map(type => `<option value="${type}">${data[type].label}</option>`)
          .join('');
      });
      stiva.dispatch('primitives');
    }
    this.elems.add.addEventListener('click', this.handleAdd.bind(this));
    this.elems.header.addEventListener('tag-update', this.handleTags.bind(this));
    this.elems.header.addEventListener('title-update', this.handleTitle.bind(this));
    this.elems.header.addEventListener('upload', this.handleUpload.bind(this));
    this.addEventListener('remove', this.handleRemove.bind(this));
    this.addEventListener('update', this.handleChange.bind(this));
    this.elems.submit.addEventListener('click', this.handleCreate.bind(this));
    this.elems.delete.addEventListener('click', this.handleDelete.bind(this));
  }
  handleRemove(e) {
    e.target.remove();
    this.handleItems();
  }
  handleChange(e) {
    e.stopPropagation();
    this.handleItems();
  }

  handleAdd(e) {
    const elem = document.createElement('item-value');
    const type = this.elems.select.value;
    const name = this.elems.name.value;

    if (type && name) {
      elem.type = type;
      elem.name = name;
      this.appendChild(elem);

      this.elems.select.selectedIndex = 0;
      this.elems.name.value = '';
      this.handleItems();
    }
  }

  handleItems() {
    this.send();
  }

  handleTags(e) {
    this.tags = e.detail.tags;
    this.send();
  }
  handleTitle(e) {
    this.titleValue = e.detail.title;
    this.send();
  }
  async handleCreate(e) {
    await this.send(true);
    window.location = `/${this.type}/${this.titleValue}`;
  }
  async handleUpload(e) {
    this.icon = this.elems.header.path;
    this.send();
  }
  async handleDelete(e) {
    let func = deleteComponent;
    if (this.type === 'template') {
      func = deleteTemplate;
    }
    await func(this.titleValue);
    window.location = `/${this.type}s`;
  }

  async send(force = false) {
    const obj = {
      meta: {
        type: this.titleValue,
        tags: this.tags ? this.tags.split(',') : [],
        icon: this.icon
      },
      values: [...this.children].map(itemValue => {
        let item = {
          name: itemValue.name,
          type: itemValue.type
        };
        if (itemValue.type === 'region') {
          item.region = itemValue.region;
          item.components = itemValue.components ? itemValue.components : [];
        }
        if (itemValue.type === 'set') {
          item.set = itemValue.set ? itemValue.set.split(',') : [];
        }
        return item;
      })
    };
    if (this.titleValue && (!this.new || force)) {
      const func = this.type === 'component' ? sendComponent : sendTemplate;
      await func(obj);
    }
  }

  static get observedAttributes() {
    return ['icon', 'new', 'title-label', 'property-label', 'type-label', 'tags-label', `add-tag-label`, 'tags', 'title-value', 'create-label', 'delete-label'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'new':
        this.elems.header.setAttribute('new', newVal);
        break;
      case 'icon':
        this.elems.header.setAttribute('icon', newVal);
        break;
      case 'title-label':
        this.elems.header.setAttribute('title-label', newVal);
        break;
      case 'title-value':
        this.elems.header.setAttribute('value', newVal);
        break;
      case 'property-label':
        this.elems.name.setAttribute('placeholder', newVal);
        this.elems.name.textContent = newVal;
        break;
      case 'type-label':
        this.elems.header.setAttribute('label', newVal);
        this.elems.select.setAttribute('label', newVal);
        break;
      case 'tags-label':
        this.elems.header.setAttribute('tags-label', newVal);
        break;
      case 'create-label':
        this.elems.submit.textContent = newVal;
        break;
      case 'delete-label':
        this.elems.delete.textContent = newVal;
        break;
      case 'add-tag-label':
        this.elems.header.setAttribute('add-tag-label', newVal);
        break;
      case 'tags':
        this.elems.header.setAttribute('tags', newVal);
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
  get icon() {
    return this.getAttribute('icon');
  }
  set icon(val) {
    if (val) {
      this.setAttribute('icon', val);
    } else {
      this.removeAttribute('icon');
    }
  }
  get titleValue() {
    return this.getAttribute('title-value');
  }
  set titleValue(val) {
    if (val) {
      this.setAttribute('title-value', val);
    } else {
      this.removeAttribute('title-value');
    }
  }
  get titleLabel() {
    return this.getAttribute('title-label');
  }
  set titleLabel(val) {
    if (val) {
      this.setAttribute('title-label', val);
    } else {
      this.removeAttribute('title-label');
    }
  }
  get typeLabel() {
    return this.getAttribute('type-label');
  }
  set typeLabel(val) {
    if (val) {
      this.setAttribute('type-label', val);
    } else {
      this.removeAttribute('type-label');
    }
  }
  get propertyLabel() {
    return this.getAttribute('property-label');
  }
  set propertyLabel(val) {
    if (val) {
      this.setAttribute('property-label', val);
    } else {
      this.removeAttribute('property-label');
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
  get addTagLabel() {
    return this.getAttribute('add-tag-label');
  }
  set addTagLabel(val) {
    if (val) {
      this.setAttribute('add-tag-label', val);
    } else {
      this.removeAttribute('add-tag-label');
    }
  }
  get createLabel() {
    return this.getAttribute('create-label');
  }
  set createLabel(val) {
    if (val) {
      this.setAttribute('create-label', val);
    } else {
      this.removeAttribute('create-label');
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
}

customElements.define('item-editor', ItemEditor);
export default ItemEditor;
