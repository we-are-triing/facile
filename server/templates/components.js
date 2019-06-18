import BaseTemplate from './base.js';
import d from '../data/facile-dictionary.js';
import {primitives, regions} from '../data/types.js';

export default class Components extends BaseTemplate {
  constructor({navigation, content, title, lang = `eng`}) {
    super(lang);
    this.createParts({navigation, content, title});
  }
  async createParts({navigation, content, title}) {
    this.bodyClass = 'fixed';
    this.head.title = title;
    this.header = this.populateHeader({navigation});
    this.page = this.populatePage(content);
    this.stiva = {primitives, regions};
  }

  populatePage(content) {
    return `
      <split-layout fixed>
        <section>
          <filter-list full section-title="${this.getLang(d.components)}" placeholder="${this.getLang(d.search)}">
            <item-tile href="/components/new" src="/static/assets/add.svg">New Component</item-tile>
            ${[...Array(100)].map(() => `<item-tile href="/components/test" src="/static/assets/mark.svg">test</item-tile>`).join('')}
          </filter-list>
        </section>
        <section>
          <component-creator 
            icon="/static/assets/mark.svg"
            title-label="${this.getLang(d.type)}" 
            property-label="${this.getLang(d.name)}" 
            type-label="${this.getLang(d.type)}"
            tags-label="${this.getLang(d.tags)}"
            add-tag-label="${this.getLang(d.add_tag)}"
            title-value="test title value" 
            tags="test,another,tester yep"
            >
            <item-value type="boolean">Test Name</item-value>
          </component-creator>
        </section>
      </split-layout>
      `;
  }
}
