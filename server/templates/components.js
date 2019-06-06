import BaseTemplate from './base.js';

export default class Components extends BaseTemplate {
  constructor({navigation, content, title, lang = `eng`}) {
    super(lang);
    this.createParts({navigation, content, title});
  }
  createParts({navigation, content, title}) {
    this.head.title = title;
    this.header = this.populateHeader({navigation});
    this.page = this.populatePage(content);
    this.footer = this.populateFooter({navigation});
  }
  populatePage(content) {
    return content
      .map(({meta, properties, content}) => {
        switch (meta.type) {
          case `title`:
            return `
              <main-block 
                class="full"
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
}
