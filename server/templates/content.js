import BaseTemplate from './base.js';
import d from '../data/facile-dictionary.js';
import {primitives, regions, mapToString} from '../../isomorphic/types.js';

export default class Content extends BaseTemplate {
  constructor({navigation, lang = `eng`, template, contentList, content = {}, templateList}) {
    super(lang);
    this.content = this.combine(content, template);
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

  combine(content, template) {
    const values = template.values.map(val => {
      if (typeof val.type === 'region') {
        val.value = content.regions.find(region => val.name === region.meta.name).regions;
      } else {
        val.value = content.values[val.name];
      }
      return val;
    });

    return {
      meta: {...template.meta, ...content.meta},
      values
    };
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
    const getMeta = meta => `name="${meta.name}"
      path="${meta.path}"
      menu="${meta.menu}"
      tags="${meta.tags}"
      publishDate="${meta.publishDate}"`;

    const labels = `
      name-label="${this.getLang(d.name)}"
      path-label="${this.getLang(d.path)}"
      menu-label="${this.getLang(d.menu)}"
      tags-label="${this.getLang(d.tags)}"
      publish-date-label="${this.getLang(d.publish_date)}"
      `;
    if (this.content) {
      const inner = this.content.values.map(val => mapToString(val)).join('');
      return `
        <content-editor 
          ${labels}
          type="${this.content.meta.type}"
          ${getMeta(this.content.meta)}
          >
          ${inner}
        </content-editor>
      `;
    }
    return ``;
  }
}
