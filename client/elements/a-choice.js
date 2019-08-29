import buildShadowRoot from './buildShadowRoot.js';

class AChoice extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          display: block;
        }
        ::slotted(main){
          display: none;
        }
        :host([selected]) ::slotted(main) {
          display: block;
        }
      </style>
      <slot></slot>
    `;
    buildShadowRoot(html, this);
    this.addEventListener('click', this.handleClick.bind(this));
  }
  handleClick(e) {
    if (e.target !== this) {
      e.stopPropagation();
      e.preventDefault();
      if (e.target.localName === 'label') {
        this.dispatchEvent(
          new Event('click', {
            bubbles: true,
            cancelable: true
          })
        );
      }
    }
  }
}

customElements.define('a-choice', AChoice);
export default AChoice;
