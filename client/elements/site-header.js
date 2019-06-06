import buildShadowRoot from './buildShadowRoot.js';
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
        section {
          background: var(--header-bg);
          box-sizing: border-box;
          width: 100%;
          border-bottom: 1px solid var(--black-100);
        }
        nav {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        :host([pinned]){
          padding-bottom: var(--height);
        }
        :host([pinned]) section{
          position: fixed;
          z-index: 1;
        }
        :host([overlay]) section{
          position: absolute;
        }
        a {
          max-height: var(--height);
          display: block;
        }
        a img {
          height: var(--height);
        }
        nav-item {
          --color: var(--black-400);
          --color-hover: var(--black);
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
          nav {
            padding: 0 var(--spacing-300) 0 0;
          }
          .nav-container {
            display: none;
            position: absolute;
            top: calc(var(--header-height) + 1px);
            left: 0;
            background: var(--white);
            width: 100%;
            text-align: center;
            padding: var(--spacing-300) var(--spacing-200);
            border-bottom: var(--border);
          }
          .nav-container.active {
            display: block;
          }
          .trigger {
            display: block;
          }
        }
      </style>
      <section>
        <nav>
          <a href="/"><img /></a>
          <div class="trigger">menu</div>
          <div class="nav-container"></div>
        </nav>
      </section>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      logo: this.shadowRoot.querySelector('img'),
      container: this.shadowRoot.querySelector('.nav-container'),
      trigger: this.shadowRoot.querySelector('.trigger')
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
    return [`logo`, `innerHTML`];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case `logo`:
        this.elems.logo.src = newVal;
        break;
      case `innerHTML`:
        this.updateChildren();
        break;
      default:
        break;
    }
  }

  get logo() {
    return this.getAttribute('logo');
  }
  set logo(val) {
    if (val) {
      this.setAttribute('logo', val);
    } else {
      this.removeAttribute('logo');
    }
  }
  get layout() {
    return this.getAttribute('layout');
  }
  set layout(val) {
    if (val) {
      this.setAttribute('layout', val);
    } else {
      this.removeAttribute('layout');
    }
  }
  get pinned() {
    return this.getAttribute('pinned');
  }
  set pinned(val) {
    if (val) {
      this.setAttribute('pinned', val);
    } else {
      this.removeAttribute('pinned');
    }
  }
  get overlay() {
    return this.getAttribute('overlay');
  }
  set overlay(val) {
    if (val) {
      this.setAttribute('overlay', val);
    } else {
      this.removeAttribute('overlay');
    }
  }

  menuHandler(e) {
    this.elems.container.classList.toggle('active', !this.elems.container.classList.contains('active'));
  }
}
customElements.define('site-header', SiteHeader);
export default SiteHeader;
