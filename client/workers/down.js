importScripts('https://cdn.jsdelivr.net/npm/marked/marked.min.js');

onmessage = e => {
  const {markdown, type = 'block'} = e.data;
  const cleaned = clean(markdown, type);
  const html = marked(cleaned);
  postMessage(html);
};

const clean = (markdown, type) => {
  return markdown;
};
