import buildShadowRoot from './buildShadowRoot.js';
import './a-tag.js';

class ItemHeader extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {}
        header {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          margin: var(--spacing-400);
        }
        div {
          height: 3.1em;
          display: flex;
        }
        img {
          height: 100%;
          cursor: pointer;
        }
      </style>
      <header>
        <div>
          <img src="/static/assets/add.svg" />
          <labeled-input class="title" large no-label></labeled-input>
        </div>
        <tag-list>
          <a-tag>test</a-tag>
          <a-tag>test 2</a-tag>
        </tag-list>
        <slot></slot>
      </header>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      title: this.shadowRoot.querySelector('labeled-input'),
      tagList: this.shadowRoot.querySelector('tag-list'),
      img: this.shadowRoot.querySelector('img')
    };
  }

  static get observedAttributes() {
    return ['title-label', 'tags-label', 'tags', `value`, `icon`];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'title-label':
        this.elems.title.textContent = newVal;
        this.elems.title.setAttribute('placeholder', newVal);
        break;
      case 'tags-label':
        this.elems.tagList.setAttribute('label', newVal);
        break;
      case 'icon':
        this.elems.img.setAttribute('src', newVal);
        break;
      case 'tags':
        this.elems.tagList.innerHTML = newVal
          .split(',')
          .map(tag => `<a-tag>${tag}</a-tag>`)
          .join('');
        break;
      case 'value':
        this.elems.title.setAttribute('value', newVal);
        break;
      default:
        break;
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
}

customElements.define('item-header', ItemHeader);
export default ItemHeader;
