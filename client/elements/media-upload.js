import buildShadowRoot from './buildShadowRoot.js';
import {sendMedia} from '../utils/services.js';
import './labeled-input.js';
import './styled-button.js';

class MediaUpload extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
        }
      </style>
      <input class="upload" type="file"/>
      <!-- TODO: add internationalization here -->
      <labeled-input class="name">name</labeled-input>
      <styled-button class="button">upload</styled-button>
      <slot></slot>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      upload: this.shadowRoot.querySelector('.upload'),
      button: this.shadowRoot.querySelector('.button'),
      name: this.shadowRoot.querySelector('.name')
    };
    this.elems.button.addEventListener('click', this.handleUpload.bind(this));
  }

  handleUpload(e) {
    if (this.elems.upload.files.length > 0 && this.elems.name.value) {
      const file = this.elems.upload.files[0];
      const name = this.elems.name.value;
      const fileData = {
        name: file.name,
        lastModified: file.lastModified,
        size: file.size,
        type: file.type
      };
      const fr = new FileReader();
      fr.onload = this.handleImageRead(fileData, name).bind(this);
      fr.readAsDataURL(file);
    }
  }

  handleImageRead(fileData, name) {
    return async e => {
      const file = e.target.result;
      const {path, filename} = await sendMedia(file, fileData, name);

      this.dispatchEvent(
        new CustomEvent('upload', {
          bubbles: true,
          detail: {
            fileData,
            file,
            name,
            path,
            filename
          }
        })
      );
    };
  }

  static get observedAttributes() {
    return ['sampleAttr'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'sampleAttr':
        this.elems.elem.setAttribute('sampleAttr', newVal);
        break;
      default:
        break;
    }
  }

  get sampleAttr() {
    return this.getAttribute('sampleAttr');
  }
  set sampleAttr(val) {
    if (val) {
      this.setAttribute('sampleAttr', val);
    } else {
      this.removeAttribute('sampleAttr');
    }
  }
}

customElements.define('media-upload', MediaUpload);
export default MediaUpload;
