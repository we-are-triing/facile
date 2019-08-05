importScripts('https://cdn.jsdelivr.net/npm/marked/marked.min.js', 'https://cdn.jsdelivr.net/npm/dompurify@1.0.11/dist/purify.min.js');

onmessage = e => {
  const {markdown, type = 'block'} = e.data;
  console.log(e, e.data, markdown, type);
  const cleaned = clean(markdown, type);
  const html = marked(cleaned);
  //const sanitized = DOMPurify.sanitize(html);
  postMessage(html);
};

const clean = (markdown, type) => {
  // whitelist allowed markdown. Replacing certain things.
  // TODO: actually have this do something
  return markdown;
};
