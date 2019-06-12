import buildShadowRoot from './buildShadowRoot.js';
import './item-header.js';
import './labeled-select.js';
import './labeled-input.js';
import './tag-list.js';
import './item-value.js';

class ComponentCreator extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          display: block;
          box-sizing: border-box;
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
      </main>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      header: this.shadowRoot.querySelector('item-header'),
      name: this.shadowRoot.querySelector('labeled-input'),
      tags: this.shadowRoot.querySelector('tag-list'),
      select: this.shadowRoot.querySelector('labeled-select'),
      add: this.shadowRoot.querySelector('an-icon')
    };
    if (stiva) {
      stiva.listen('primitives', data => {
        this.elems.select.innerHTML = Object.keys(data)
          .map(type => `<option value="${type}">${data[type].label}</option>`)
          .join('');
      });
    }
    this.elems.add.addEventListener('click', this.handleAdd.bind(this));
  }

  handleAdd(e) {
    const elem = document.createElement('item-value');
    const type = this.elems.select.value;
    const name = this.elems.name.value;

    if (type && name) {
      this.elems.select.selectedIndex = 0;
      this.elems.name.value = '';
      elem.type = type;
      elem.textContent = name;
      this.appendChild(elem);
    }
  }

  static get observedAttributes() {
    return ['icon', 'title-label', 'property-label', 'type-label', 'tags-label', `add-tag-label`, 'tags', 'title-value'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
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
      case 'tag-label':
        this.elems.header.setAttribute('tags-label', newVal);
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
}

customElements.define('component-creator', ComponentCreator);
export default ComponentCreator;
