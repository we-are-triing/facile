import BaseTemplate from './base.js';
import d from '../data/facile-dictionary.js';
import {primitives, regions, mapToString} from '../../isomorphic/types.js';

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
    const html = /*html*/ `
      <split-layout fixed>
        <section>
          <filter-list full list section-title="${this.getLang(d.content)}">
            <nav-folder vertical label="${this.getLang(d.create)}">
            ${this.generateTemplateList()}
            </nav-folder>
            ${this.generateContentList()}
          </filter-list>
        </section>
        <section>
          ${this.loadContentDetails()}
        </section>
      </split-layout>
      `;
    return html;
  }

  generateContentList() {
    return this.list.map(({name}) => `<nav-item vertical href="/content/${name}">${name}</nav-item>`).join('');
  }
  generateTemplateList() {
    return this.templateList.map(({meta}) => `<nav-item vertical href="/content/new/${meta.type}">${meta.type}</nav-item>`).join('');
  }

  loadContentDetails() {
    const labels = `
      name-label="${this.getLang(d.name)}"
      slug-label="${this.getLang(d.slug)}" 
      path-label="${this.getLang(d.path)}"
      menu-label="${this.getLang(d.menu)}"
      tags-label="${this.getLang(d.tags)}"
      `;
    if (this.template) {
      return `
        <content-editor 
          ${labels}
          type="${this.template.meta.type}"
          >
          ${this.template.values.map(val => mapToString(val)).join('')}
        </content-editor>
      `;
    }
    return ``;
  }
}
