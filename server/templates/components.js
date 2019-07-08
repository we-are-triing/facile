import BaseTemplate from './base.js';
import d from '../data/facile-dictionary.js';
import {primitives, regions} from '../data/types.js';

export default class Components extends BaseTemplate {
  constructor({navigation, components, component = {}, lang = `eng`}) {
    super(lang);
    this.createParts({navigation, components, component});
  }
  async createParts({navigation, components, component}) {
    this.bodyClass = 'fixed';
    this.head.title = component.meta ? component.meta.type : this.getLang(d.components);
    this.header = this.populateHeader({navigation});
    this.page = this.populatePage(components, component);
    this.stiva = {primitives, regions, components};
  }

  populatePage(components, component) {
    return `
      <split-layout fixed>
        <section>
          <filter-list full section-title="${this.getLang(d.components)}" placeholder="${this.getLang(d.search)}">
            <item-tile href="/component/new" src="/static/assets/add.svg">${this.getLang(d.new_component)}</item-tile>
            ${components.map(({type, icon, tags}) => `<item-tile href="/component/${type}" src="${icon}" tags="${tags}">${type}</item-tile>`).join('')}
          </filter-list>
        </section>
        <section>
          ${this.loadComponentDetails(component)}
        </section>
      </split-layout>
      `;
  }
  loadComponentDetails(component) {
    const labels = `
      title-label="${this.getLang(d.type)}" 
      property-label="${this.getLang(d.name)}" 
      type-label="${this.getLang(d.type)}"
      tags-label="${this.getLang(d.tags)}"
      create-label="${this.getLang(d.create)}"
      delete-label="${this.getLang(d.delete)}"
      add-tag-label="${this.getLang(d.add_tag)}"
      `;

    if (component === 'new') {
      return `
      <component-creator
        ${labels}
        new
        >
      </component-creator>
    `;
    }
    if (component.meta) {
      return `
        <component-creator 
          ${labels}
          icon="${component.meta.icon}"
          title-value="${component.meta.type}" 
          ${component.meta.tags.length > 0 ? `tags="${component.meta.tags.join(',')}"` : ''}
          >
          ${this.mapVals(component.values)}
        </component-creator>
      `;
    }
    return ``;
  }
  mapVals(vals = []) {
    return vals.map(({name, type, region = '', components = []}) => `<item-value type="${type}" name="${name}"${type === 'region' ? ` region="${region}">${this.mapComponents(components)}` : '>'}</item-value>`).join('');
  }
  mapComponents(components) {
    //TODO: get the src for this.
    return components.map(c => `<item-tile src="test" closeable>${c}</item-tile>`).join('');
  }
}
