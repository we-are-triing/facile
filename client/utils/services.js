const storeRoot = `http://localhost:8001`;
const mediaRoot = `http://localhost:8002`;
const fetchOptions = {
  mode: 'cors',
  headers: {'Content-Type': 'application/json'}
};

const send = async (item, compOrTemplate) => {
  const temp = await fetch(`${storeRoot}/${compOrTemplate}/${item.meta.type}`, fetchOptions);
  const result = await temp.json();
  const isUpdate = result.length > 0;

  let path = `${storeRoot}/${compOrTemplate}/create`;
  if (isUpdate) {
    path = `${storeRoot}/${compOrTemplate}/update`;
  }
  const body = JSON.stringify(item);

  const res = await fetch(path, {
    ...fetchOptions,
    method: 'POST',
    body
  });

  return await res.json();
};

const del = async (type, compOrTemplate) => {
  const del = await fetch(`${storeRoot}/${compOrTemplate}/delete`, {
    ...fetchOptions,
    method: 'DELETE',
    body: JSON.stringify({type})
  });
  return await del.json();
};

export const sendComponent = async component => send(component, 'component');
export const sendTemplate = async template => send(template, 'template');

export const deleteComponent = async type => del(type, 'component');
export const deleteTemplate = async type => del(type, 'template');

export const sendMedia = async (file, meta) => {
  const res = await fetch(`${mediaRoot}/media`, {
    mode: 'cors',
    method: `POST`,
    body: JSON.stringify({
      tags: [],
      name: 'temp',
      media: file,
      meta
    })
  });
  return await res.json();
};
