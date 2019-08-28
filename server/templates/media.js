import BaseTemplate from './base.js';
import d from '../data/facile-dictionary.js';

export default class Media extends BaseTemplate {
  constructor({navigation, lang = `eng`, list, media = 'none', baseUrl = '/'}) {
    super(lang);
    this.list = list;
    this.media = media;
    this.baseUrl = baseUrl;
    this.createParts(navigation);
  }
  async createParts(navigation) {
    this.bodyClass = 'fixed';
    this.header = this.populateHeader({navigation});
  }

  async populatePage() {
    return `
      <split-layout fixed>
        <section>
        <filter-list full section-title="${this.getLang(d.media)}" placeholder="${this.getLang(d.search)}">
          <item-tile href="/media/new" src="/static/assets/add.svg">${this.getLang(d.new_media_item)}</item-tile>
          ${this.list.map(({filename, name, tags}) => `<item-tile href="/media/${filename}" src="${this.baseUrl}/${filename}" tags="${tags}">${name}</item-tile>`).join('')}
        </filter-list>
        </section>
        <section>
        </section>
      </split-layout>
      `;
  }
}
