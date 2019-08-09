export const down = async md => up(md, 'block');
export const downline = async md => up(md, 'inline');

const up = async (md, type) => {
  try {
    const {html, markdown} = await handler(md, type);
    return {html, markdown};
  } catch (err) {
    console.error(err);
  }
};

const handler = (md, type) => {
  const worker = new Worker('/static/workers/down.js');
  worker.postMessage({markdown: md, type});

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
