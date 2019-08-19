importScripts('https://cdn.jsdelivr.net/npm/marked/marked.min.js');

onmessage = e => {
  let html = marked(e.data);
  postMessage(html);
};
