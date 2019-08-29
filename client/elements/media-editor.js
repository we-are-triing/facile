import buildShadowRoot from './buildShadowRoot.js';
import './media-meta.js';
import './tabular-data-item.js';
import './tabular-data.js';

class MediaEditor extends HTMLElement {
  constructor() {
    super();
    const html = /*html*/ `
      <style>
        :host {
        }
        ::slotted(media-meta){
          display: none;
        }
        .data {
          display: grid;
          grid-template-columns: 50% 50%;
          width: 100%;
          place-items: center;
        }
        img {
          max-width: 100%;
        }
        tabular-data{
          height: 100%;
        }
      </style>
      <section class="data">
        <img class="main" />
        <tabular-data>
          <tabular-data-item editable heading label="name" class="name"></tabular-data-item>
          <tabular-data-item label="filename" class="filename"></tabular-data-item>
          <tabular-data-item label="dimensions" class="dimensions"></tabular-data-item>
        </tabular-data>
      </section>
      <section class="derivatives">
        <slot></slot>
      </section>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      table: this.shadowRoot.querySelector('tabular-data'),
      name: this.shadowRoot.querySelector('.name'),
      filename: this.shadowRoot.querySelector('.filename'),
      img: this.shadowRoot.querySelector('img.main'),
      dimensions: this.shadowRoot.querySelector('.dimensions')
    };

    this.observer = this.watchChildren();
    this.updateChildren();
    this.elems.img.onload = this.imageSize.bind(this);
  }

  watchChildren() {
    return new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        this.updateChildren();
      });
    });
  }

  updateChildren() {
    this.observer.disconnect();

    [...this.elems.table.children].forEach(child => child.classList.contains('meta') && child.remove());

    [...this.children].forEach(child => {
      if (child.localName === 'media-meta') {
        const elem = document.createElement('tabular-data-item');
        elem.classList.add('meta');
        elem.label = child.key;
        elem.textContent = child.textContent;
        this.elems.table.appendChild(elem);
      }
    });

    this.observer.observe(this, {childList: true});
  }

  static get observedAttributes() {
    return ['filename', 'name'];
  }

  imageSize() {
    this.elems.dimensions.textContent = `${this.elems.img.naturalHeight}x${this.elems.img.naturalWidth}`;
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'filename':
        this.elems.filename.textContent = newVal;
        // TODO: this needs to be updated with URL strategy
        this.elems.img.src = `http://localhost:8002/${newVal}`;

        break;
      case 'name':
        this.elems.name.textContent = newVal;
        break;
      default:
        break;
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
  get master() {
    return this.getAttribute('master');
  }
  set master(val) {
    if (val) {
      this.setAttribute('master', val);
    } else {
      this.removeAttribute('master');
    }
  }
}

customElements.define('media-editor', MediaEditor);
export default MediaEditor;
