import buildShadowRoot from './buildShadowRoot.js';
class SplitLayout extends HTMLElement {
  constructor() {
    super();
    const html = /*html*/ `
      <style>
        :host {
          --left-size: 18rem;
          --scrubber-size: var(--spacing-300);
          display: grid;
          grid-template-columns: var(--left-size) 1fr;
          min-height: 100%;
        }

        /* hide all but the first two sections */
        ::slotted(*) {
          display: none;
        }

        ::slotted(section:first-child),
        ::slotted(section:nth-child(2)) {
          display: block;
        }

        :host([size='half']) {
          --left-size: 50%;
        }

        :host([fixed]) {
          height: 100%;
        }

        :host([fixed]) ::slotted(section){
          height: 100%;
          overflow: auto;
        }

        :host([divider]) ::slotted(section:first-child){
          border-right: var(--border);
        }

        .scrubber {
          display: none;
          width: var(--scrubber-size);
          height: 100%;
          position: absolute;
          top: 50%;
          left: var(--left-size);
          transform: translate(-50%, -50%);
          cursor: col-resize;
        }

        .scrubber.scrubbing {
          --scrubber-size: 500px;
        }

        :host([scrubable]) .scrubber {
          display: block;
        }
      </style>
      <slot></slot>
      <span class="scrubber"></span>
    `;
    buildShadowRoot(html, this);

    this.scrub = false;
    this.elems = {
      scrubber: this.shadowRoot.querySelector('.scrubber')
    };
    this.elems.scrubber.addEventListener('mousedown', this.handleDown.bind(this));
    this.elems.scrubber.addEventListener('touchstart', this.handleDown.bind(this));

    this.elems.scrubber.addEventListener('mousemove', this.handleScrub.bind(this));
    this.elems.scrubber.addEventListener('touchmove', this.handleTouchScrub.bind(this));

    this.elems.scrubber.addEventListener('mouseup', this.handleUp.bind(this));
    this.elems.scrubber.addEventListener('touchend', this.handleUp.bind(this));
  }
  handleDown(e) {
    this.scrub = true;
    this.elems.scrubber.classList.add('scrubbing');
    this.width = this.clientWidth;
  }
  handleScrub(e) {
    if (this.scrub) {
      this.changeWidth(e.clientX);
    }
  }
  handleTouchScrub(e) {
    if (this.scrub) {
      this.changeWidth(e.targetTouches[0].clientX);
    }
  }
  handleUp(e) {
    this.scrub = false;
    this.elems.scrubber.classList.remove('scrubbing');
  }
  changeWidth(x) {
    const offset = this.offsetParent.offsetLeft;
    let w = x - offset;
    if (w < 200) {
      w = 200;
    } else if (w > this.width - 200 - offset) {
      w = this.width - 200 - offset;
    }
    this.style.setProperty(`--left-size`, `${w}px`);
  }
}
customElements.define('split-layout', SplitLayout);
export default SplitLayout;
