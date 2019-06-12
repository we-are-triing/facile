import buildShadowRoot from './buildShadowRoot.js';
import './item-header.js';

class ComponentCreator extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          display: block;
          box-sizing: border-box;
        } 
        an-icon {
          cursor: pointer;
          color: var(--main);
        }
      </style>
      <item-header></item-header>
      <main>
        <slot></slot>
        <section class="new">
          <labeled-input class="new_name"></labeled-input>
          <labeled-select>
            <option></option>
          </labeled-select>
          <an-icon type="add"></an-icon>
        </section>
      </main>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      header: this.shadowRoot.querySelector('item-header'),
      newTitle: this.shadowRoot.querySelector('labeled-input.new_name'),
      tags: this.shadowRoot.querySelector('tag-list')
    };
  }

  static get observedAttributes() {
    return ['icon', 'title-label', 'property-label', 'type-label', 'tags-label', 'tags', 'title-value'];
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
        this.elems.newTitle.setAttribute('placeholder', newVal);
        this.elems.newTitle.textContent = newVal;
        break;
      case 'type-label':
        this.elems.header.setAttribute('label', newVal);
        break;
      case 'tags-label':
        this.elems.header.setAttribute('tags-label', newVal);
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
