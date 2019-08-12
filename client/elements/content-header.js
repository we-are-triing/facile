import buildShadowRoot from './buildShadowRoot.js';
import './labeled-input.js';
import './tag-list.js';

class ContentHeader extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
        }
        header {
          display: flex;
          border-bottom: var(--border);
        }
        header div {
          flex-basis: 50%;
        }
      </style>
      <header>
        <div>
          <labeled-input class="name"></labeled-input>
          <labeled-input class="slug"></labeled-input>
          <labeled-input class="path"></labeled-input>
          <labeled-input class="menu"></labeled-input>
        </div>
        <div>
          <tag-list></tag-list>
        </div>
        <slot></slot>
      </header>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      name: this.shadowRoot.querySelector('.name'),
      slug: this.shadowRoot.querySelector('.slug'),
      path: this.shadowRoot.querySelector('.path'),
      menu: this.shadowRoot.querySelector('.menu'),
      tags: this.shadowRoot.querySelector('tag-list'),
      header: this.shadowRoot.querySelector('header')
    };
    this.elems.tags.addEventListener('tag-update', this.handleTags.bind(this));
    this.elems.header.addEventListener('change', this.handleChange.bind(this));
  }

  handleChange(e) {
    switch (e.target) {
      case this.elems.name:
        this.name = e.target.value;
        break;
      case this.elems.slug:
        this.slug = e.target.value;
        break;
      case this.elems.path:
        this.path = e.target.value;
        break;
      case this.elems.menu:
        this.menu = e.target.value;
        break;
      default:
        break;
    }
    this.sendChange();
  }

  handleTags(e) {
    this.tags = e.detail.tags;
    this.sendChange();
  }

  sendChange() {
    this.dispatchEvent(
      new Event('header-change', {
        bubbles: true
      })
    );
  }

  static get observedAttributes() {
    return ['name-label', 'slug-label', 'path-label', 'menu-label', 'tags-label', 'name', 'slug', 'path', 'menu', 'tags'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'name-label':
        this.elems.name.textContent = newVal;
        this.elems.name.setAttribute('placeholder', newVal);
        break;
      case 'slug-label':
        this.elems.slug.textContent = newVal;
        this.elems.slug.setAttribute('placeholder', newVal);
        break;
      case 'path-label':
        this.elems.path.textContent = newVal;
        this.elems.path.setAttribute('placeholder', newVal);
        break;
      case 'menu-label':
        this.elems.menu.textContent = newVal;
        this.elems.menu.setAttribute('placeholder', newVal);
        break;
      case 'tags-label':
        this.elems.tags.label = newVal;
        break;
      case 'name':
        this.elems.name.setAttribute('value', newVal);
        break;
      case 'slug':
        this.elems.slug.setAttribute('value', newVal);
        break;
      case 'path':
        this.elems.path.setAttribute('value', newVal);
        break;
      case 'menu':
        this.elems.menu.setAttribute('value', newVal);
        break;
      case 'tags':
        this.elems.tags.innerHTML = newVal
          .split(',')
          .map(tag => `<a-tag>${tag}</a-tag>`)
          .join('');
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
  get slug() {
    return this.getAttribute('slug');
  }
  set slug(val) {
    if (val) {
      this.setAttribute('slug', val);
    } else {
      this.removeAttribute('slug');
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
}

customElements.define('content-header', ContentHeader);
export default ContentHeader;
