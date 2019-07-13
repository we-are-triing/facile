import buildShadowRoot from './buildShadowRoot.js';
import './tabbed-content.js';
import './tab-panel.js';

class ImageUpload extends HTMLElement {
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
          </tab-panel>
          <tab-panel tabtitle="add">
            <input class="upload" type="file" />
          </tab-panel>
        </tabbed-content>
        
      </div>
      <slot></slot>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      img: this.shadowRoot.querySelector('img'),
      upload: this.shadowRoot.querySelector('.upload'),
      menu: this.shadowRoot.querySelector('.menu')
    };
    this.elems.upload.addEventListener('change', this.handleUpload.bind(this));
    this.elems.img.addEventListener('click', this.toggleMenu.bind(this));
  }

  toggleMenu() {
    this.elems.menu.classList.toggle('active');
  }

  handleUpload(e) {
    const file = e.target.files[0];
    const fileData = {
      name: file.name,
      lastModified: file.lastModified,
      size: file.size,
      type: file.type
    };
    const fr = new FileReader();
    fr.onload = this.handleImageRead(fileData).bind(this);
    fr.readAsDataURL(file);
  }

  handleImageRead(fileData) {
    return e => {
      this.elems.img.src = e.target.result;
      this.toggleMenu();
      this.dispatchEvent(
        new CustomEvent('upload', {
          bubbles: true,
          detail: {
            fileData,
            file: e.target.result
          }
        })
      );
    };
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

customElements.define('image-upload', ImageUpload);
export default ImageUpload;
