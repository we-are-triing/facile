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
    return `
      <split-layout fixed>
        <section>
          
        </section>
        <section>
          
        </section>
      </split-layout>
      `;
  }
}
