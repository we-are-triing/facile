import buildShadowRoot from './buildShadowRoot.js';

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
        :host(:last-of-type){
          border-bottom: none;
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
      </style>
      <section class="view active">
        <div class="labels">
          <slot></slot>:
          <span></span>
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
    `;
    buildShadowRoot(html, this);
    this.elems = {
      type: this.shadowRoot.querySelector('span'),
      newName: this.shadowRoot.querySelector('labeled-input.new_name'),
      newType: this.shadowRoot.querySelector('labeled-select'),
      delete: this.shadowRoot.querySelector('an-icon.delete'),
      edit: this.shadowRoot.querySelector('an-icon.edit'),
      update: this.shadowRoot.querySelector('an-icon.check'),
      close: this.shadowRoot.querySelector('an-icon.close'),
      editView: this.shadowRoot.querySelector('section.edit'),
      viewView: this.shadowRoot.querySelector('section.view')
    };
    this.elems.delete.addEventListener('click', this.handleDelete.bind(this));

    this.elems.edit.addEventListener('click', this.showEdit.bind(this));
    this.elems.close.addEventListener('click', this.showView.bind(this));

    this.elems.update.addEventListener('click', this.handleEdit.bind(this));

    if (stiva) {
      stiva.listen('primitives', this.handlePrimitives.bind(this));
      stiva.dispatch('primitives');
    }
  }
  handlePrimitives(data) {
    this.elems.newType.innerHTML = Object.keys(data)
      .map(type => `<option value="${type}"${data[type].label === this.type ? ' selected' : ''}>${data[type].label}</option>`)
      .join('');
  }
  handleDelete(e) {
    this.dispatchEvent(
      new Event('remove', {
        bubbles: true
      })
    );
  }
  handleEdit(e) {
    this.type = this.elems.newType.value;
    this.textContent = this.elems.newName.value;
    this.showView();
    this.dispatchEvent(
      new Event('update', {
        bubbles: true
      })
    );
  }

  showEdit() {
    this.elems.editView.classList.add('active');
    this.elems.viewView.classList.remove('active');
    this.elems.newType.value = this.type;
    this.elems.newName.value = this.textContent;
  }
  showView() {
    this.elems.editView.classList.remove('active');
    this.elems.viewView.classList.add('active');
  }

  static get observedAttributes() {
    return ['type'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'type':
        this.elems.type.textContent = newVal;
        this.elems.newType.value = newVal;
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
}

customElements.define('item-value', ItemValue);
export default ItemValue;
