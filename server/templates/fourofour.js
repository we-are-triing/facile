import BaseTemplate from './base.js';

export default class Home extends BaseTemplate {
  constructor({navigation, lang = `eng`}) {
    super(lang);
    this.createParts({navigation});
  }
  createParts({navigation}) {
    this.head.title = 'Imaginary Friends';
    this.header = this.populateHeader({navigation});
    this.page = this.populatePage();
  }
  populatePage() {
    return `
      <h1>Sorry this isn't a real page. Just a pretend one.</h1>
    `;
  }
}
