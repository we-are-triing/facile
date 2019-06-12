import BaseTemplate from './base.js';
import d from '../data/facile-dictionary.js';

export default class Components extends BaseTemplate {
  constructor({navigation, content, title, lang = `eng`}) {
    super(lang);
    this.createParts({navigation, content, title});
  }
  createParts({navigation, content, title}) {
    this.bodyClass = 'fixed';
    this.head.title = title;
    this.header = this.populateHeader({navigation});
    this.page = this.populatePage(content);
  }

  pageContent(content) {
    return content
      .map(({meta, properties, content}) => {
        switch (meta.type) {
          case `title`:
            return `
        <main-block 
          class=""
          heading="${properties.title}" 
          lede="${properties.lede}" 
          src="${properties.img}">
        </main-block>
      `;
          case `content`:
            return `<content-block class="narrow">${properties.content}</content-block>`;
          case `tile-list`:
            return `
        <tile-list 
          title="${properties.title}" 
          description="${properties.description}" 
          cta="${properties.cta}" 
          href="${properties.link}">
            ${content
              .map(
                ({meta: m, properties: p}) => `
                  <item-tile 
                  title="${p.title}" 
                    link="${p.link}" 
                    src="${p.src}" >
                      ${p.description}
                  </item-tile>
                `
              )
              .join(``)}
        </tile-list>
      `;
          case `media`:
            return `
        <media-block 
          class="mid-width"
          title="${properties.title}" 
          caption="${properties.caption}" 
          img="${properties.img}">
        </media-block>
              `;
          default:
            return ``;
        }
      })
      .join(``);
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
            title-value="test title value" 
            property-label="${this.getLang(d.name)}" 
            type-label="${this.getLang(d.type)}"
            tags-label="${this.getLang(d.tags)}"
            tags="test,another,tester yep"
            >
          </component-creator>
        </section>
      </split-layout>
      `;
  }
}
