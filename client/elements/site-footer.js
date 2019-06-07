import buildShadowRoot from './buildShadowRoot.js';
class SiteFooter extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          --link-color: var(--white, #fff);
          --link-color-hover: var(--white, #fff);
          --height: var(--footer-height, 3em);

          display: block;
        }
        footer {
          box-sizing: border-box;
          background: var(--main, #ccc);
          font-size: var(--font-size-400);
          padding: 0 var(--spacing-500);
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: var(--height);
        }
        ::slotted(nav-item){
          margin-right: 1em;
        } 
        /* TODO: get this outta here */
        @media screen and (max-width: 36em){
         footer {
           flex-direction: column;
           padding: var(--spacing-300);
         }
         nav {
           padding-bottom: var(--spacing-200);
         }
         span {
           font-size: var(--font-size-300);
         }
        }
      </style>
      <footer>
        <nav>
          <slot></slot>
        </nav>
        <span>©${new Date().getFullYear()}<em></em> Luce Studio</span>
      </footer>
    `;
    buildShadowRoot(html, this);
  }
}

customElements.define('site-footer', SiteFooter);
export default SiteFooter;
