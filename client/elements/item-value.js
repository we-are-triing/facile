import buildShadowRoot from './buildShadowRoot.js';
import './region-editor.js';
import './set-editor.js';
import './an-icon.js';
import './labeled-input.js';
import './labeled-select.js';

class ItemValue extends HTMLElement {
  constructor() {
    super();
    const html = /* html */ `
      <style>
        :host {
          display: block;
          padding: var(--spacing-300);
          border-bottom: var(--border);
        }
        .labels {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .labels *:first-child {
          display: block;
        }
        section.view.active {
          display: flex;
          
        }
        section.edit.active {
          display: flex;
          align-items: center;
        }
        .labels {
          display: flex;
          align-items: center;
          margin: var(--spacing-300) 0;
        }
        .labels > * {
          margin-right: var(--spacing-200);
        }
        .labels labeled-input {
          margin-top: 0;
        }
        section.view, 
        section.edit {
          display: none;
          justify-content: space-between;
          align-items: center;
        }
        .view .actions {
          opacity: 0;
        }
        .actions an-icon {
          cursor: pointer;
          font-size: 1.6em;
        }
        :host(:hover) .view .actions,
        :host(:active) .view .actions {
          opacity: 1;
        }
        .region, .set {
          display: none;
        }
        :host([type="region"]) .region,
        :host([type="set"]) .set {
          display: block;
        }
      </style>
      <section class="view active">
        <div class="labels">
          <span class="name"></span>:
          <span class="type"></span>
        </div>
        <div class="actions">
          <an-icon type="edit" class="edit"></an-icon>
          <an-icon type="delete" class="delete"></an-icon>
        </div>
      </section>
      <section class="edit">
        <div class="labels">
          <labeled-input no-label class="new_name"></labeled-input>
          <labeled-select no-label>
            <option></option>
          </labeled-select>
        </div>
        <div class="actions">
          <an-icon type="close" class="close"></an-icon>
          <an-icon type="check" class="check"></an-icon>
        </div>
      </section>
      <region-editor class="region"></region-editor>
      <set-editor class="set"></set-editor>
    `;
    buildShadowRoot(html, this);
    this.elems = {
      name: this.shadowRoot.querySelector('span.name'),
      type: this.shadowRoot.querySelector('span.type'),
      newName: this.shadowRoot.querySelector('labeled-input.new_name'),
      newType: this.shadowRoot.querySelector('labeled-select'),
      delete: this.shadowRoot.querySelector('an-icon.delete'),
      edit: this.shadowRoot.querySelector('an-icon.edit'),
      update: this.shadowRoot.querySelector('an-icon.check'),
      close: this.shadowRoot.querySelector('an-icon.close'),
      editView: this.shadowRoot.querySelector('section.edit'),
      viewView: this.shadowRoot.querySelector('section.view'),
      region: this.shadowRoot.querySelector('region-editor'),
      set: this.shadowRoot.querySelector('set-editor')
    };
    this.elems.delete.addEventListener('click', this.handleDelete.bind(this));

    this.elems.edit.addEventListener('click', this.showEdit.bind(this));
    this.elems.close.addEventListener('click', this.showView.bind(this));

    this.elems.update.addEventListener('click', this.handleEdit.bind(this));
    this.elems.region.addEventListener('update', this.handleChange.bind(this));
    this.elems.set.addEventListener('change', this.handleChange.bind(this));

    if (stiva) {
      stiva.listen('primitives', this.handlePrimitives.bind(this));
      stiva.dispatch('primitives');
    }

    this.observer = this.watchChildren();
    this.updateChildren();
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

    [...this.elems.region.children].forEach(child => child.remove());

    [...this.children].forEach(child => {
      if (child.localName === 'item-tile') {
        this.elems.region.appendChild(child.cloneNode(true));
      }
    });

    this.observer.observe(this, {childList: true});
  }

  handlePrimitives(data) {
    this.elems.newType.innerHTML = Object.keys(data)
      .map(type => `<option value="${type}"${data[type].label === this.type ? ' selected' : ''}>${data[type].label}</option>`)
      .join('');
  }

  handleEdit(e) {
    this.type = this.elems.newType.value;
    this.name = this.elems.newName.value;
    this.showView();
    this.handleChange();
  }
  handleChange() {
    this.set = this.elems.set.value;

    this.region = this.elems.region.type;
    this.components = this.elems.region.components;

    this.dispatchEvent(
      new Event('update', {
        bubbles: true
      })
    );
  }

  handleDelete(e) {
    this.dispatchEvent(
      new Event('remove', {
        bubbles: true
      })
    );
  }

  showEdit() {
    this.elems.editView.classList.add('active');
    this.elems.viewView.classList.remove('active');
    this.elems.newType.value = this.type;
    this.elems.newName.value = this.name;
  }
  showView() {
    this.elems.editView.classList.remove('active');
    this.elems.viewView.classList.add('active');
  }

  static get observedAttributes() {
    return ['type', 'name', 'region', `set`];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'type':
        this.elems.type.textContent = newVal;
        break;
      case 'name':
        this.elems.name.textContent = newVal;
        break;
      case 'region':
        this.elems.region.type = newVal;
        break;
      case 'set':
        this.elems.set.value = newVal;
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
  get region() {
    return this.getAttribute('region');
  }
  set region(val) {
    if (val) {
      this.setAttribute('region', val);
    } else {
      this.removeAttribute('region');
    }
  }
  get set() {
    return this.getAttribute('set');
  }
  set set(val) {
    if (val) {
      this.setAttribute('set', val);
    } else {
      this.removeAttribute('set');
    }
  }
  get components() {
    return this.elems.region.components;
  }
}

customElements.define('item-value', ItemValue);
export default ItemValue;
