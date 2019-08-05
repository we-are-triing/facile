import BaseTemplate from './base.js';
import d from '../data/facile-dictionary.js';
import {primitives, regions} from '../../isomorphic/types.js';

export default class Components extends BaseTemplate {
  constructor({navigation, components, component = {}, lang = `eng`}) {
    super(lang);
    this.components = components;
    this.component = component;
    this.createParts(navigation);
  }
  createParts(navigation) {
    this.bodyClass = 'fixed';
    this.head.title = this.component.meta ? this.component.meta.type : this.getLang(d.components);
    this.header = this.populateHeader({navigation});
    this.page = this.populatePage();
    this.stiva = {primitives, regions, components: this.components};
  }

  populatePage() {
    return `
      <split-layout fixed>
        <section>
          <filter-list full section-title="${this.getLang(d.components)}" placeholder="${this.getLang(d.search)}">
            <item-tile href="/component/new" src="/static/assets/add.svg">${this.getLang(d.new_component)}</item-tile>
            ${this.components.map(({type, icon, tags}) => `<item-tile href="/component/${type}" src="${icon}" tags="${tags}">${type}</item-tile>`).join('')}
          </filter-list>
        </section>
        <section>
          ${this.loadComponentDetails()}
        </section>
      </split-layout>
      `;
  }
  loadComponentDetails() {
    const labels = `
      title-label="${this.getLang(d.type)}" 
      property-label="${this.getLang(d.name)}" 
      type-label="${this.getLang(d.type)}"
      tags-label="${this.getLang(d.tags)}"
      create-label="${this.getLang(d.create)}"
      delete-label="${this.getLang(d.delete)}"
      add-tag-label="${this.getLang(d.add_tag)}"
      `;

    if (this.component === 'new') {
      return `
      <component-editor
        ${labels}
        new
        >
      </component-editor>
    `;
    }
    if (this.component.meta) {
      return `
        <component-editor 
          ${labels}
          icon="${this.component.meta.icon}"
          title-value="${this.component.meta.type}" 
          ${this.component.meta.tags.length > 0 ? `tags="${this.component.meta.tags.join(',')}"` : ''}
          >
          ${this.mapVals(this.component.values)}
        </component-editor>
      `;
    }
    return ``;
  }
  mapVals(vals = []) {
    return vals.map(({name, type, region = '', components = []}) => `<item-value type="${type}" name="${name}"${type === 'region' ? ` region="${region}">${this.mapComponents(components)}` : '>'}</item-value>`).join('');
  }
  mapComponents(components) {
    return components
      .map(c => {
        const item = this.components.find(i => i.type === c);
        return `<item-tile src="${item.icon}" closeable>${c}</item-tile>`;
      })
      .join('');
  }
}
