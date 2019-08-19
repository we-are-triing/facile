export const down = async md => markup(md, 'block');
export const downline = async md => markup(md, 'inline');
export const up = async md => clean(md, 'block');
export const upline = async md => clean(md, 'inline');

const markup = async md => {
  try {
    const html = await handler(md);
    return html;
  } catch (err) {
    console.error(err);
  }
};

const handler = (md, type) => {
  const worker = new Worker('/static/workers/down.js');
  worker.postMessage(md);

  return new Promise((res, rej) => {
    const t = setTimeout(() => {
      worker.terminate();
      rej('Down took to long to run.');
    }, 500);
    worker.onmessage = e => {
      clearTimeout(t);
      res(e.data);
      worker.terminate();
    };
  });
};

const clean = (markdown, type) => {
  const blacklist = type === 'inline' ? inline : block;
  const flattened = blacklist.reduce((a, n) => [...a, ...n]);
  return flattened.reduce((a, n) => a.replace(new RegExp(n, 'gi'), ''), markdown);
};

const words = `[\\w \\t]+`;
const nl = `[\\n\\r]`;

const ib = char => `${char}${words}${char}`;
const inlineBoundary = arr => arr.map(item => ib(item));

const sw = char => `${nl}${char}`;
const startsWith = arr => arr.map(item => sw(item));

const oc = (open, close, w = words) => `${open}${w}${close}`;

const features = {
  boldItalic: inlineBoundary([`\\*+`, `_+`]),
  strike: inlineBoundary([`~+`]),
  heading: startsWith([`# `, '=+']),
  subheadings: startsWith(['##+ ', '-+']),
  link: [`${oc('\\[', '\\]')}${oc('\\(', '\\)')}`, `.*?`],
  image: [`!${oc('\\[', '\\]')}${oc('\\(', '\\)', `.*?`)}`],
  blockquote: startsWith(['> ']),
  lists: startsWith(['\\* ', '- ', '\\d\\. ', '\\d\\) ']),
  rule: startsWith(['---', '\\*\\*\\*']),
  code: ['`'],
  code_block: startsWith(['```', '    ']),
  markup: ['<.*?>'],
  paragraphs: [nl]
};

const inline = [features.heading, features.subheadings, features.image, features.blockquote, features.lists, features.rule, features.code_block, features.markup, features.paragraphs];
const block = [features.heading, features.image, features.markup];
