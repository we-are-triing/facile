import buildShadowRoot from './buildShadowRoot.js';

class SplitLayout extends HTMLElement {
  constructor() {
    super();
    const html = /*html*/ `
      <style>
        :host {
          display: grid;
        }
        
        :host([size="small"]) :slotted() {

        }
        
        :host([size="large"]) :slotted() {

        }

        :host([scrubable]){
         /* TODO: css prop manipulation through JS for scrubbing */ 
        }
      </style>
      <slot></slot>
    `;
    buildShadowRoot(html, this);
  }
}

customElements.define('split-layout', SplitLayout);
export default SplitLayout;
