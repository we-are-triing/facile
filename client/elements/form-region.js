import buildShadowRoot from './buildShadowRoot.js';
import {getComponentData} from '../utils/services.js';
import {mapToElement} from '../isomorphic/types.js';
import './item-tile.js';
import './region-item.js';

class FormRegion extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block;
        }
        section {
          border: var(--border);
        }
        :host([type="fixed"]) .add,
        :host([type="static"]) .add {
          display: none;
        }
        .showList {
          display: none;
          padding: var(--sizing-200);
          border: var(--border);
        }
        .showList.active {
          display: flex;
        }
        .showList item-tile {
          width: 6em;
        }
      </style>
      <span class="name"></span>
      <section>
        <slot></slot>
        <an-icon class="add" type="add_closed"></an-icon>
        <div class="showList"></div>
      </section>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      name: this.shadowRoot.querySelector('.name'),
      add: this.shadowRoot.querySelector('.add'),
      showList: this.shadowRoot.querySelector('.showList')
    };

    this.elems.add.addEventListener('click', this.toggleList.bind(this));
    this.elems.showList.addEventListener('click', this.addForm.bind(this));
    this.addEventListener('item-change', this.handleChanges.bind(this));
  }

  handleChanges(e) {
    console.log(e.detail);
    this.dispatchEvent(
      new CustomEvent('region-change', {
        bubbles: true,
        detail: e.detail
      })
    );
  }

  async updateList(components) {
    this.list = await getComponentData(components);
    this.elems.showList.innerHTML = this.list.map(({meta}) => `<item-tile src="${meta.icon}">${meta.type}</item-tile>`).join('');
  }

  toggleList() {
    this.elems.showList.classList.toggle('active');
  }

  addForm(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.localName === 'item-tile') {
      const component = this.getComponentData(e.target.textContent);

      if (this.type === 'single') {
        this.innerHTML = ``;
      }

      this.appendChild(this.createComponentFormElement(component));

      this.toggleList();
    }
  }

  createComponentFormElement(component) {
    const elem = document.createElement('region-item');
    elem.type = component.meta.type;
    elem.icon = component.meta.icon;
    component.values.forEach(val => elem.appendChild(mapToElement(val)));
    return elem;
  }

  getComponentData(type) {
    return this.list.find(item => item.meta.type === type);
  }

  static get observedAttributes() {
    return ['type', 'name', 'components'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'name':
        this.elems.name.textContent = newVal;
        break;
      case 'components':
        this.updateList(newVal);
        break;
      default:
        break;
    }
  }

  get type() {
    return this.getAttribute('type');
  }
  set type(val) {
    // `fluid`, `fixed`, `single`, `static`
    if (val) {
      this.setAttribute('type', val);
    } else {
      this.removeAttribute('type');
    }
  }
  get name() {
    return this.getAttribute('name');
  }
  set name(val) {
    if (val) {
      this.setAttribute('name', val);
    } else {
      this.removeAttribute('name');
    }
  }
  get components() {
    return this.getAttribute('components');
  }
  set components(val) {
    if (val) {
      this.setAttribute('components', val);
    } else {
      this.removeAttribute('components');
    }
  }
}

customElements.define('form-region', FormRegion);
export default FormRegion;
