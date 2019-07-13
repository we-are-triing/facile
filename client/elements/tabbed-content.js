import buildShadowRoot from './buildShadowRoot.js';
import './tab-panel.js';

class TabbedContent extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
    <style>
      :host {
        display: block;
        --border: #eee;
        --main: #eee;
        --lh: var(--lh-300, 1.6em);
      }
      section {
        max-width: 46em;
        margin: 0 auto;
        line-height: var(--lh);
      }
      ::slotted(tab-panel){
        display: none;
      }
      ::slotted(tab-panel.active){
        display: block;
      }
      .tabs {
        border-bottom: 1px solid var(--border);
      }
      .tab {
        display: inline-block;
        padding: 0.3em 0.6em;
        cursor: pointer;
        background: var(--main);
        border: 1px solid var(--border);
        position:relative;
        top: 1px;
        font-size: 0.8em;
      }
      .tab.active {
        background: white;
        border-bottom-color: white;
      }
    </style>
    <section class="tabs"></section>
    <section class="content">
      <slot></slot>
    </section>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      tabs: this.shadowRoot.querySelector('.tabs'),
      panels: this.shadowRoot.querySelector('.content')
    };
    this.elems.tabs.addEventListener('click', this.handleActiveChange.bind(this));
    this.observer = this.watchChildren();
    this.updateTabs();
  }

  //This goes in the constructor:

  watchChildren() {
    return new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        this.updateTabs();
      });
    });
  }

  updateTabs() {
    this.observer.disconnect();
    const hasActive = this.elems.tabs.querySelectorAll('.active').length > 0;
    [...this.elems.tabs.children].forEach(child => child.remove());

    [...this.children].forEach((child, i) => {
      if (child.localName === 'tab-panel') {
        let tabTitle = child.getAttribute('tabtitle');
        this.elems.tabs.innerHTML += `<span class="tab${!hasActive && i === 0 ? ` active` : ``}" data-tabtitle="${tabTitle}" >${tabTitle}</span>`;
        if (!hasActive && i === 0) {
          child.classList.add('active');
        }
      }
    });

    this.observer.observe(this, {childList: true});
  }

  handleActiveChange(e) {
    if (e.target.classList.contains('tab')) {
      const active = e.target.dataset.tabtitle;

      let currentTab = this.elems.tabs.querySelector(`.tab.active`);
      let currentPanel = this.querySelector(`tab-panel.active`);
      currentTab && currentTab.classList.remove('active');
      currentPanel && currentPanel.classList.remove('active');

      let newTab = this.elems.tabs.querySelector(`[data-tabtitle="${active}"]`);
      let newPanel = this.querySelector(`[tabtitle="${active}"]`);
      newTab && newTab.classList.add('active');
      newPanel && newPanel.classList.add('active');
    }
  }
}
customElements.define('tabbed-content', TabbedContent);
export default TabbedContent;
