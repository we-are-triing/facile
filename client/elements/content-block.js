import buildShadowRoot from './buildShadowRoot.js';
class ContentBlock extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          display: block;
          --line-height: var(--lh-300, 1.6);
        }
        section {
          margin-top: 2em;
          margin-bottom: 2em;
          line-height: var(--line-height);
        }
      </style>
      <section>
        <slot></slot>
      </section>
    `;

    buildShadowRoot(html, this);
  }
}
customElements.define('content-block', ContentBlock);
export default ContentBlock;
