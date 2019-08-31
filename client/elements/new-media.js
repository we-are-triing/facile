import buildShadowRoot from './buildShadowRoot.js';
import {sendMedia} from '../utils/services.js';
import './media-upload.js';

class NewMedia extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
        }
      </style>
      <media-upload></media-upload>
      <slot></slot>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      upload: this.shadowRoot.querySelector('media-upload')
    };
    this.elems.upload.addEventListener('upload', this.handleUpload.bind(this));
  }

  async handleUpload(e) {
    const {filename} = e.detail;
    window.location = `/media/${filename}`;
  }
}

customElements.define('new-media', NewMedia);
export default NewMedia;
