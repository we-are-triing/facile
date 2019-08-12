import buildShadowRoot from './buildShadowRoot.js';
import './item-tile.js';

class RegionEditor extends HTMLElement {
  constructor() {
    super();
    const html = /*html*/ `
      <style>
        :host {
        }
        .container {
          position: relative;
        }
        ::slotted(*){
          display: none;
        }
        ::slotted(item-tile){
          display: block;
        }
        section {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          border: var(--border);
        }
        ::slotted(item-tile), 
        item-tile {
          width: 120px;
        }
        .add-area {
          position: relative;
        }
        .components {
          border: var(--border);
          position: absolute;
          background: var(--bianco);
          top: var(--spacing-400);
          left: var(--spacing-400);
          white-space: nowrap;
          display: none;
          max-width: 300%;
        }
        .components.active {
          display: block;
        }
        item-tile[new].hide{
          display: none;
        }
        .components ul {
          list-style: none;
          margin: 0;
          padding: var(--spacing-200);
          display: flex;
        }
        .components li {
          cursor: pointer;
        }
        
      </style>
      <div class="container">
        <labeled-select no-label>
          <option></option>
        </labeled-select>
        <section>
          <slot></slot>
          <div class="add-area">
            <item-tile new src="/static/assets/add.svg"><!-- TODO -->The label</item-tile>
            <div class="components">
              <ul></ul>
            </div>
          </div>
        </section>
        
      <div>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      types: this.shadowRoot.querySelector('labeled-select'),
      add: this.shadowRoot.querySelector('item-tile[new]'),
      componentList: this.shadowRoot.querySelector('.components ul'),
      components: this.shadowRoot.querySelector('.components')
    };

    if (stiva) {
      stiva.listen('components', list => {
        this.list = list;
        this.updateComponentOptions();
      });
      stiva.dispatch('components');
      stiva.listen('regions', data => {
        const keys = Object.keys(data);
        this.elems.types.innerHTML = keys.map(type => `<option value="${type}">${data[type].label}</option>`).join('');
        if (!this.type) {
          this.type = keys[0];
        }
      });
      stiva.dispatch('regions');
    }

    this.elems.types.addEventListener('change', this.typeChange.bind(this));
    this.elems.add.addEventListener('click', this.toggleAdd.bind(this));
    this.elems.componentList.addEventListener('click', this.handleAdd.bind(this));
    this.addEventListener('click', this.handleClick);
    this.addEventListener('close', this.handleRemoveComponent.bind(this));
  }

  handleRemoveComponent(e) {
    e.target.remove();
    // this.elems.components.classList.toggle('active');
    this.updateComponentOptions();
    this.sendChange();
  }

  handleClick(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  typeChange(e) {
    this.type = e.target.value;
    this.sendChange();
  }

  updateComponentOptions() {
    const components = this.list.filter(({type}) => ![...this.children].reduce((a, n) => (a ? a : type === n.textContent), false));
    if (components.length > 0) {
      this.elems.componentList.innerHTML = components.map(({type, icon, tags}) => `<li tags="${tags.join(',')}"><item-tile src="${icon}">${type}</item-tile></li>`).join('');
      this.elems.add.classList.remove('hide');
    } else {
      this.elems.componentList.innterHTML = '';
      this.elems.add.classList.add('hide');
    }
  }

  sendChange() {
    this.dispatchEvent(
      new Event('update', {
        bubbles: true
      })
    );
  }

  toggleAdd(e) {
    e.stopPropagation();
    e.preventDefault();
    this.updateComponentOptions();
    this.elems.components.classList.toggle('active');
  }

  handleAdd(e) {
    const tag = e.target.tagName.toLowerCase();
    if (tag === 'ul') {
      return;
    }

    let elem = e.target;

    const el = document.createElement('item-tile');
    el.textContent = elem.textContent;
    el.setAttribute('src', elem.src);
    el.setAttribute('closeable', '');
    this.appendChild(el);
    this.elems.components.classList.toggle('active');
    this.updateComponentOptions();
    this.sendChange();
  }

  static get observedAttributes() {
    return ['type'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'type':
        this.elems.types.value = newVal;
        break;
      default:
        break;
    }
  }

  get type() {
    return this.getAttribute('type');
  }
  set type(val) {
    if (val) {
      this.setAttribute('type', val);
    } else {
      this.removeAttribute('type');
    }
  }

  get label() {
    return this.getAttribute('label');
  }
  set label(val) {
    if (val) {
      this.setAttribute('label', val);
    } else {
      this.removeAttribute('label');
    }
  }

  get components() {
    return [...this.children].filter(child => child.localName === 'item-tile').map(child => child.textContent);
  }
}

customElements.define('region-editor', RegionEditor);
export default RegionEditor;
