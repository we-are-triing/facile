importScripts('https://cdn.jsdelivr.net/npm/marked/marked.min.js');

onmessage = e => {
  const {markdown, type = 'block'} = e.data;
  const cleaned = clean(markdown, type);
  let html = marked(cleaned);
  postMessage({html, markdown: cleaned});
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
