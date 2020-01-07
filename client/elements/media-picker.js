import buildShadowRoot from './buildShadowRoot.js';
import './tabbed-content.js';
import './tab-panel.js';
import './media-upload.js';
import './media-select.js';

class MediaPicker extends HTMLElement {
  constructor() {
    super();
    //TODO: add translation
    const html = /* html */ `
      <style>
        :host {
          display: block;
          height: 100%;
          cursor: pointer;
          position: relative;
        }
        .menu {
          display: none;
          position: absolute;
          left: var(--spacing-300);
          top: var(--spacing-300);
          background: var(--bianco);
          z-index: var(--z-100);
          width: 40vw;
          min-height: 200px;
          border: var(--border);
        }
        .menu.active {
          display: block;
        }
        img {
          max-width: 100%;
          max-height: 100%;
        }
      </style>
      <img src="/static/assets/add.svg" />
      <div class="menu">
        <tabbed-content>
          <tab-panel tabtitle="choose">
            <media-select></media-select>
          </tab-panel>
          <tab-panel tabtitle="add">
            <media-upload></media-upload>
          </tab-panel>
        </tabbed-content>
      </div>
      <slot></slot>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      img: this.shadowRoot.querySelector('img'),
      upload: this.shadowRoot.querySelector('media-upload'),
      select: this.shadowRoot.querySelector('media-select'),
      menu: this.shadowRoot.querySelector('.menu')
    };
    this.elems.upload.addEventListener('upload', this.handleUpload.bind(this));
    this.elems.select.addEventListener('selected', this.handleSelected.bind(this));
    this.elems.img.addEventListener('click', this.toggleMenu.bind(this));
  }

  toggleMenu() {
    this.elems.menu.classList.toggle('active');
  }
  handleUpload(e) {
    const {file, filename, path} = e.detail;
    this.elems.img.src = file;
    this.path = path;
    this.filename = filename;
    this.toggleMenu();
    this.send();
  }
  handleSelected(e) {
    this.elems.img.src = this.elems.select.path;
    this.path = this.elems.select.path;
    this.filename = this.elems.select.filename;
    this.toggleMenu();
    this.send();
  }
  send() {
    this.dispatchEvent(
      new CustomEvent('image-change', {
        bubbles: true,
        detail: {
          path: this.path,
          filename: this.filename
        }
      })
    );
  }

  static get observedAttributes() {
    return ['src'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'src':
        this.elems.img.setAttribute('src', newVal);
        break;
      default:
        break;
    }
  }

  get src() {
    return this.getAttribute('src');
  }
  set src(val) {
    if (val) {
      this.setAttribute('src', val);
    } else {
      this.removeAttribute('src');
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
}

customElements.define('media-picker', MediaPicker);
export default MediaPicker;
