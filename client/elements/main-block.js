import buildShadowRoot from './buildShadowRoot.js';
class MainBlock extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          display: block;
          --img: var(--main);
          --title-lh: var(--lh-100, 1.1);
        }
        * {
          box-sizing: border-box;
        }
        section {
          height: 100%;
          width: 100%;
          // TODO: make it an option to have light text.
          // background: linear-gradient(to top, var(--main-t), var(--main-t)), var(--img) no-repeat 50% 50%;
          background: var(--img) no-repeat 50% 50%;
          background-size: cover;
          color: var(--black);
          text-align: center;
          padding: var(--spacing-700) 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        section h1,
        section .lede {
          width: 70%;
          margin-left: auto;
          margin-right: auto;
        }
        h1 {
          font-size: var(--font-size-900);
          margin: 0;
          font-family: var(--serif);
          font-weight: 300;
          line-height: var(--title-lh);
        }
        .lede {
          font-weight: 300;
          line-height: var(--lh-200);
          margin: var(--spacing-50) 0 var(--spacing-500) 0;
        }
      </style>
      <section>
        <h1></h1>
        <p class="lede"></p>
        <slot></slot>
      </section>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      container: this.shadowRoot.querySelector('section'),
      title: this.shadowRoot.querySelector('h1'),
      lede: this.shadowRoot.querySelector('p.lede')
    };
  }

  static get observedAttributes() {
    return [`heading`, `lede`, `src`];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case `heading`:
        this.elems.title.innerText = newVal;
        break;
      case `lede`:
        this.elems.lede.innerText = newVal;
        break;
      case `src`:
        this.style.setProperty(`--img`, `url(${newVal})`);
        break;
      default:
        break;
    }
  }

  get heading() {
    return this.getAttribute('heading');
  }
  set heading(val) {
    if (val) {
      this.setAttribute('heading', val);
    } else {
      this.removeAttribute('heading');
    }
  }
  get lede() {
    return this.getAttribute('lede');
  }
  set lede(val) {
    if (val) {
      this.setAttribute('lede', val);
    } else {
      this.removeAttribute('lede');
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
customElements.define('main-block', MainBlock);
export default MainBlock;
