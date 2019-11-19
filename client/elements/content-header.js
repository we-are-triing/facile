import buildShadowRoot from './buildShadowRoot.js';
import './labeled-input.js';
import './tag-list.js';
import './content-status.js';
import './styled-button.js';

class ContentHeader extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          background: var(--nero-100);
          display: block;
        }
        header {
          display: flex;
          border-bottom: var(--border);
        }
        div {
          flex-basis: 50%;
          padding: var(--spacing-200);
        }
        div > *:first-child {
          margin-top: 0;
        }
        styled-button {
          display: none;
        }
        styled-button.active {
          display: block;
        }
      </style>
      <header>
        <div>
          <labeled-input disabled class="name"></labeled-input>
          <styled-button>save</styled-button>
          <labeled-input class="path"></labeled-input>
        </div>
        <div>
          <tag-list></tag-list>
          <labeled-input type="date" class="date"></labeled-input>
          <content-status align="right"></content-status>
        </div>
        <slot></slot>
      </header>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      name: this.shadowRoot.querySelector('.name'),
      path: this.shadowRoot.querySelector('.path'),
      tags: this.shadowRoot.querySelector('tag-list'),
      header: this.shadowRoot.querySelector('header'),
      date: this.shadowRoot.querySelector('.date'),
      status: this.shadowRoot.querySelector('content-status'),
      save: this.shadowRoot.querySelector('styled-button')
    };
    this.elems.tags.addEventListener('tag-update', this.handleTags.bind(this));
    this.elems.header.addEventListener('change', this.handleChange.bind(this));
    this.elems.save.addEventListener('click', this.handleSave.bind(this));
  }

  handleSave(e) {
    this.dispatchEvent(
      new Event('save', {
        bubbles: true
      })
    );
  }

  handleChange(e) {
    switch (e.target) {
      case this.elems.name:
        this.name = e.target.value;
        break;
      case this.elems.path:
        this.path = e.target.value;
        break;
      case this.elems.date:
        this.publishDate = e.target.value;
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
    return ['name-label', 'new', 'path-label', 'tags-label', 'publish-date-label', 'name', 'path', 'tags', 'publish-date'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'new':
        this.elems.name.removeAttribute('disabled');
        this.elems.save.classList.add('active');
        break;
      case 'name-label':
        this.elems.name.textContent = newVal;
        this.elems.name.setAttribute('placeholder', newVal);
        break;
      case 'path-label':
        this.elems.path.textContent = newVal;
        this.elems.path.setAttribute('placeholder', newVal);
        break;
      case 'tags-label':
        this.elems.tags.label = newVal;
        break;
      case 'publish-date-label':
        this.elems.date.textContent = newVal;
        this.elems.date.setAttribute('placeholder', newVal);
        break;
      case 'name':
        this.elems.name.value = newVal;
        break;
      case 'path':
        this.elems.path.value = newVal;
        break;
      case 'tags':
        this.elems.tags.innerHTML = newVal
          .split(',')
          .map(tag => `<a-tag>${tag}</a-tag>`)
          .join('');
        break;
      case 'publish-date':
        if (!newVal) {
          this.elems.status.status = 'draft';
        } else {
          const today = new Date();
          const pub = new Date(newVal);
          this.elems.date.value = pub;
          if (pub.getTime() > today.getTime() && pub.getTime() > 0) {
            this.elems.status.status = 'scheduled';
          } else {
            this.elems.status.status = 'published';
          }
        }

        this.elems.date.value = newVal;
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

customElements.define('content-header', ContentHeader);
export default ContentHeader;
