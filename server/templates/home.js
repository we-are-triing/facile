import BaseTemplate from './base.js';

export default class Home extends BaseTemplate {
  constructor({navigation, title, lang = `eng`}) {
    super(lang);
    this.createParts({navigation, title});
  }
  createParts({navigation, title}) {
    this.head.title = title;
    this.header = this.populateHeader({navigation});
  }
  async populatePage() {
    return `<h1>Welcome Home!</h1>`;
  }
}
