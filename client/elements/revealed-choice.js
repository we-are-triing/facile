import buildShadowRoot from './buildShadowRoot.js';

class RevealedChoice extends HTMLElement {
  constructor() {
    super();
    const html = `
      <style>
        :host {
          display: block;
        }
      </style>
      <section></section>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      container: this.shadowRoot.querySelector('section')
    };
    this.observer = this.watchChildren();
    this.updateChildren();
    this.elems.container.addEventListener('click', this.handleClick.bind(this));
  }
  watchChildren() {
    return new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        this.updateChildren();
      });
    });
  }

  updateChildren() {
    this.observer.disconnect();

    [...this.elems.container.children].forEach(child => child.remove());

    [...this.children].forEach(child => {
      if (child.localName === 'a-choice') {
        this.elems.container.appendChild(child.cloneNode(true));
      }
    });

    this.observer.observe(this, {attributes: true, childList: true, subtree: true});
  }

  handleClick(e) {
    if (e.target.localName === `a-choice`) {
      const i = [...this.elems.container.children].indexOf(e.target);
      this.children[i].toggleAttribute('selected');
    }
  }
}

customElements.define('revealed-choice', RevealedChoice);
export default RevealedChoice;
