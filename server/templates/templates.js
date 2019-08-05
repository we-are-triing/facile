import BaseTemplate from './base.js';
import d from '../data/facile-dictionary.js';
import {primitives, regions} from '../../isomorphic/types.js';

export default class Templates extends BaseTemplate {
  constructor({navigation, templates = [], template = {}, components = [], lang = `eng`}) {
    super(lang);
    this.templates = templates;
    this.template = template;
    this.components = components;
    this.createParts(navigation);
  }
  async createParts(navigation) {
    this.bodyClass = 'fixed';
    this.head.title = this.template.meta ? this.template.meta.type : this.getLang(d.templates);
    this.header = this.populateHeader({navigation});
    this.page = this.populatePage();
    this.stiva = {primitives, regions, components: this.components};
  }

  populatePage() {
    return `
      <split-layout fixed>
        <section>
          <filter-list full section-title="${this.getLang(d.templates)}" placeholder="${this.getLang(d.search)}">
            <item-tile href="/template/new" src="/static/assets/add.svg">${this.getLang(d.new_template)}</item-tile>
            ${this.templates.map(c => `<item-tile href="/template/${c.meta.type}" src="${c.meta.icon}">${c.meta.type}</item-tile>`).join('')}
          </filter-list>
        </section>
        <section>
          ${this.loadTemplateDetails()}
        </section>
      </split-layout>
      `;
  }
  loadTemplateDetails() {
    const labels = `
      title-label="${this.getLang(d.type)}" 
      property-label="${this.getLang(d.name)}" 
      type-label="${this.getLang(d.type)}"
      tags-label="${this.getLang(d.tags)}"
      create-label="${this.getLang(d.create)}"
      delete-label="${this.getLang(d.delete)}"
      add-tag-label="${this.getLang(d.add_tag)}"
      `;
    if (this.template === 'new') {
      return `
      <template-editor
        ${labels}
        new
        >
      </template-editor>
    `;
    }
    if (this.template.meta) {
      return `
        <template-editor 
          ${labels}
          icon="${this.template.meta.icon}"
          title-value="${this.template.meta.type}" 
          ${this.template.meta.tags.length > 0 ? `tags="${this.template.meta.tags.join(',')}"` : ''}
          >
          ${this.mapVals(this.template.values)}
        </template-editor>
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
