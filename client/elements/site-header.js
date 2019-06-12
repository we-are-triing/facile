import buildShadowRoot from './buildShadowRoot.js';
import './an-icon.js';
import './site-language.js';

class SiteHeader extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          display: block;
          --header-bg: var(--white, RGBA(255, 255, 255, 1));
          --header-bg-trans: var(--main-t, RGBA(0, 69, 99, 0.7));
          --height: var(--header-height, 5em);
        }
        * {
          box-sizing: border-box;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--header-bg);
          box-sizing: border-box;
          width: 100%;
          border-bottom: 1px solid var(--nero-100);
        }
        nav.main {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        nav.secondary {
          font-size: var(--font-size-600);
          display: flex
        }
        .nav-container {
          font-size: var(--font-size-300);
        }
        
        nav.main a {
          max-height: var(--height);
          display: block;

        }
        nav.main a an-icon {
          font-size: var(--height);
        }
        .trigger {
          display: none;
          border: var(--border);
          border-radius: var(--br-400);
          padding: var(--spacing-150) var(--spacing-200);
          font-size: var(--font-size-400);
        }

        /* TODO: get this outta here */
        @media screen and (max-width: 36em){
         
        }
      </style>
      <header>
        <nav class="main">
          <a href="/"><an-icon type="facile"></an-icon></a>
          <div class="trigger">menu</div>
          <div class="nav-container"></div>
        </nav>
        <nav class="secondary">
          <an-icon type="search"></an-icon>
          <an-icon type="account"></an-icon>
          <site-language language="eng"></site-language>
        </nav>
      </header>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      container: this.shadowRoot.querySelector('.nav-container'),
      trigger: this.shadowRoot.querySelector('.trigger'),
      lang: this.shadowRoot.querySelector('site-language')
    };
    this.observer = this.watchChildren();
    this.updateChildren();
    this.elems.trigger.addEventListener('click', this.menuHandler.bind(this));
  }
  watchChildren() {
    let observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        this.updateChildren();
      });
    });

    observer.observe(this, {childList: true});
    return observer;
  }

  updateChildren() {
    this.observer.disconnect();

    [].slice.apply(this.elems.container.children).forEach(child => child.remove());
    [].slice.apply(this.children).forEach(child => this.elems.container.appendChild(child.cloneNode(true)));

    this.observer.observe(this, {childList: true});
  }

  static get observedAttributes() {
    return [`innerHTML`, `lang`];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case `lang`:
        this.elems.lang.language = newVal;
        break;
      case `innerHTML`:
        this.updateChildren();
        break;
      default:
        break;
    }
  }

  get lang() {
    return this.getAttribute('lang');
  }
  set lang(val) {
    if (val) {
      this.setAttribute('lang', val);
    } else {
      this.removeAttribute('lang');
    }
  }

  menuHandler(e) {
    this.elems.container.classList.toggle('active', !this.elems.container.classList.contains('active'));
  }
}
customElements.define('site-header', SiteHeader);
export default SiteHeader;
