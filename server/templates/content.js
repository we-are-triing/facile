import BaseTemplate from './base.js';
import d from '../data/facile-dictionary.js';
import {primitives, regions} from '../data/types.js';

export default class Components extends BaseTemplate {
  constructor({navigation, lang = `eng`}) {
    super(lang);
    this.createParts(navigation);
  }
  createParts(navigation) {
    this.bodyClass = 'fixed';
    this.head.title = this.getLang(d.content);
    this.header = this.populateHeader({navigation});
    this.page = this.populatePage();
  }

  populatePage() {
    return /*html*/ `
      <split-layout fixed>
        <section>
          <filter-list full list section-title="${this.getLang(d.content)}">
            <nav-item add href="/content/new">${this.getLang(d.create)}</nav-item>
            <nav-item folder>folder</nav-item>
            <nav-item item>item</nav-item>
          </filter-list>
        </section>
        <section>
          <content-editor></content-editor>
        </section>
      </split-layout>
      `;
  }
}
