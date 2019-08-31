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
          display: inline-block;
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
          width: 200px;
          border: var(--border);
        }
        .menu.active {
          display: block;
        }
        img {
          height: 100%;
        }
      </style>
      <img />
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
      menu: this.shadowRoot.querySelector('.menu')
    };
    this.elems.upload.addEventListener('upload', this.handleUpload.bind(this));
    this.elems.img.addEventListener('click', this.toggleMenu.bind(this));
  }

  toggleMenu() {
    this.elems.menu.classList.toggle('active');
  }
  handleUpload(e) {
    const {file, fileData, name} = e.detail;
    this.elems.img.src = file;
    this.toggleMenu();
    this.dispatchEvent(
      new CustomEvent('upload', {
        bubbles: true,
        detail: {
          file,
          fileData,
          name
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
}

customElements.define('media-picker', MediaPicker);
export default MediaPicker;
