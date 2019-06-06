export default class BaseTemplate {
  constructor(lang = `eng`) {
    this.head = {};
    this.elementList = [];
    this.header = ``;
    this.footer = ``;
    this.page = ``;
    this.lang = lang;
  }
  render() {
    const body = `
      ${this.header}
      <main>
        ${this.page}
      </main>
      ${this.footer}
    `;
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">

        <meta property="og:site_name" content="Luce Studio">
        <title>${this.head.title}</title>

        ${this.head.content}
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,700,700i|Playfair+Display:400,400i" rel="stylesheet">
        <link rel="stylesheet" href="/static/index.css" />
        <script src="/static/polyfills/webcomponents-loader.js"></script>
        ${this.parseElements(body)
          .map(name => {
            return `<script type="module" src="/static/elements/${name}.js"></script>`;
          })
          .join('')}

        <script src="/stiva.js"></script>
        <script>
          stiva = new Stiva(${JSON.stringify(this.stiva)});
          window.addEventListener('WebComponentsReady', e => {
            // want to get it off the thread so all other handlers can run;
            setTimeout(() => stiva.dispatchAll(), 300);
            document.body.classList.add('WebComponentsReady');
          });
        </script>
      </head>
      <body>
        ${body}
        ${
          process.env.NODE_ENV === 'dev'
            ? `
            <script src="/static/lib/socket.io.js"></script>
                <script>
                  let socket = io('/');
                  socket.on('reload', () => location.reload());
                  socket.on('delayed-reload', () => setTimeout(() => location.reload(), 3000 ));
                </script>
          `
            : ``
        }
      </body>
    </html>
  `;
  }
  populateHeader({navigation}) {
    return `
            <site-header logo="/static/assets/mark.svg">
              ${navigation
                .map(({href, text}) => {
                  return `<nav-item href="${href}">${this.getLang(text)}</nav-item>`;
                })
                .join('')}
            </site-header>
        `;
  }
  populateFooter({navigation}) {
    return `
            <site-footer>
              ${navigation
                .map(({href, text}) => {
                  return `<nav-item href="${href}">${this.getLang(text)}</nav-item>`;
                })
                .join('')}
            </site-footer>
        `;
  }
  parseElements(str) {
    const reg = /(?:<|is=")\w+?-[\w-]+(?:\s*?|>)/gi;
    const matches = str.match(reg);
    return matches ? [...new Set(matches.map(s => s.replace(/^(<|is=")/gi, '')))] : [];
  }
  getLang(obj) {
    return obj[this.lang];
  }
}
