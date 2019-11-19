import BaseTemplate from './base.js';
import d from '../data/facile-dictionary.js';
import {combine, mapToString} from '../utils/render.js';

export default class Content extends BaseTemplate {
  constructor({navigation, lang = `eng`, template, contentList, content, templateList}) {
    super(lang);
    this.new = !content;
    this.content = content ? combine(content, template) : template;
    this.list = contentList;
    this.templateList = templateList;
    this.createParts(navigation);
  }
  createParts(navigation) {
    this.bodyClass = 'fixed';
    this.head.title = this.getLang(d.content);
    this.header = this.populateHeader({navigation});
    if (this.templateList) {
      this.stiva = {
        templates: this.templateList.map(({meta}) => ({type: meta.type}))
      };
    }
  }

  async populatePage() {
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
          ${await this.loadContentDetails()}
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

  async loadContentDetails() {
    const getMeta = meta => `name="${meta.name || ''}"
      path="${meta.path || ''}"
      tags="${meta.tags || ''}"
      publish-date="${meta.publish_date || ''}"`;

    const labels = `
      name-label="${this.getLang(d.name)}"
      path-label="${this.getLang(d.path)}"
      tags-label="${this.getLang(d.tags)}"
      delete-label="${this.getLang(d.delete)}"
      publish-date-label="${this.getLang(d.publish_date)}"
      `;
    if (this.content) {
      const inner = await Promise.all(this.content.values.map(async val => mapToString(val)));
      const inn = inner.join('');
      return `
        <content-editor 
          ${this.new ? 'new' : ''}
          ${labels}
          type="${this.content.meta.type}"
          ${getMeta(this.content.meta)}
          >
          ${inn}
        </content-editor>
      `;
    }
    return ``;
  }
}
