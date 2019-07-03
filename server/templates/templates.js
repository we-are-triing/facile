import BaseTemplate from './base.js';
import d from '../data/facile-dictionary.js';
import {primitives, regions} from '../data/types.js';

export default class Templates extends BaseTemplate {
  constructor({navigation, templates = [], template = {}, components = [], lang = `eng`}) {
    super(lang);
    this.createParts({navigation, templates, template, components});
  }
  async createParts({navigation, templates, template, components}) {
    this.bodyClass = 'fixed';
    this.head.title = template.meta ? template.meta.type : this.getLang(d.templates);
    this.header = this.populateHeader({navigation});
    this.page = this.populatePage(templates, template);
    this.stiva = {primitives, regions, components};
  }

  populatePage(templates, template) {
    return `
      <split-layout fixed>
        <section>
          <filter-list full section-title="${this.getLang(d.templates)}" placeholder="${this.getLang(d.search)}">
            <item-tile href="/template/new" src="/static/assets/add.svg">${this.getLang(d.new_template)}</item-tile>
            ${templates.map(c => `<item-tile href="/template/${c.meta.type}" src="${c.meta.icon}">${c.meta.type}</item-tile>`).join('')}
          </filter-list>
        </section>
        <section>
          ${this.loadTemplateDetails(template)}
        </section>
      </split-layout>
      `;
  }
  loadTemplateDetails(template) {
    const labels = `
      title-label="${this.getLang(d.type)}" 
      property-label="${this.getLang(d.name)}" 
      type-label="${this.getLang(d.type)}"
      tags-label="${this.getLang(d.tags)}"
      create-label="${this.getLang(d.create)}"
      delete-label="${this.getLang(d.delete)}"
      add-tag-label="${this.getLang(d.add_tag)}"
      `;
    if (template === 'new') {
      return `
      <template-creator
        ${labels}
        new
        >
      </template-creator>
    `;
    }
    if (template.meta) {
      const vals = template.values || {};
      return `
        <template-creator 
          ${labels}
          icon="${template.meta.icon}"
          title-value="${template.meta.type}" 
          ${template.meta.tags.length > 0 ? `tags="${template.meta.tags.join(',')}"` : ''}
          >
          ${Object.keys(vals)
            .map(key => `<item-value type="${vals[key]}">${key}</item-value>`)
            .join('')}
        </template-creator>
      `;
    }
    return ``;
  }
}
