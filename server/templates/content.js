import BaseTemplate from './base.js';
import d from '../data/facile-dictionary.js';
import {primitives, regions} from '../../isomorphic/types.js';

export default class Components extends BaseTemplate {
  constructor({navigation, lang = `eng`, template, contentList, content = {}, templateList}) {
    super(lang);
    this.template = template;
    this.content = content;
    this.list = contentList;
    this.templateList = templateList;
    this.createParts(navigation);
  }
  createParts(navigation) {
    this.bodyClass = 'fixed';
    this.head.title = this.getLang(d.content);
    this.header = this.populateHeader({navigation});
    this.page = this.populatePage();
    if (this.templateList) {
      this.stiva = {
        templates: this.templateList.map(({meta}) => ({type: meta.type}))
      };
    }
  }

  populatePage() {
    return /*html*/ `
      <split-layout fixed>
        <section>
          <filter-list full list section-title="${this.getLang(d.content)}">
            <nav-item add href="/content/new">${this.getLang(d.create)}</nav-item>
            ${this.generateContentList()}
          </filter-list>
        </section>
        <section>
          ${this.loadContentDetails()}
        </section>
      </split-layout>
      `;
  }

  generateContentList() {
    return this.list.map(({name}) => `<nav-item href="/content/${name}" item>${name}</nav-item>`).join('');
  }

  loadContentDetails() {
    const labels = `
      name-label="${this.getLang(d.name)}" 
      slug-label="${this.getLang(d.slug)}" 
      path-label="${this.getLang(d.path)}"
      menu-label="${this.getLang(d.menu)}"
      tags-label="${this.getLang(d.tags)}"
      `;
    if (this.template === 'new') {
      return `
      <content-editor
        ${labels}
        new
        >
      </content-editor>
    `;
    }
    if (this.content.meta) {
      return `
        <content-editor 
          ${labels}
          >
          ${this.template.values.map(({type, region, components, name}) => `<form-region type="${region}" name="${name}" components="${components.join(',')}"></form-region>`).join('')}
        </content-editor>
      `;
    }
    return ``;
  }
}
