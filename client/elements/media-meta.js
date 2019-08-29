import buildShadowRoot from './buildShadowRoot.js';

class MediaMeta extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          display:none;
        }
      </style>
      <slot></slot>
    `;
    buildShadowRoot(html, this);
  }

  get key() {
    return this.getAttribute('key');
  }
  set key(val) {
    if (val) {
      this.setAttribute('key', val);
    } else {
      this.removeAttribute('key');
    }
  }
}

customElements.define('media-meta', MediaMeta);
export default MediaMeta;
