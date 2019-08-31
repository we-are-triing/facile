const storeRoot = `http://localhost:8001`;
const mediaRoot = `http://localhost:8002`;
const fetchOptions = {
  mode: 'cors',
  headers: {'Content-Type': 'application/json'}
};

const get = async (type, route) => {
  const temp = await fetch(`${storeRoot}/${route}/${type}`);
  return temp.json();
};

const send = async (item, route, id) => {
  const temp = await fetch(`${storeRoot}/${route}/${id}`, fetchOptions);
  const result = await temp.json();
  const isUpdate = result.length > 0;

  let path = `${storeRoot}/${route}/create`;
  if (isUpdate) {
    path = `${storeRoot}/${route}/update`;
  }
  const body = JSON.stringify(item);
  const res = await fetch(path, {
    ...fetchOptions,
    method: 'POST',
    body
  });

  return await res.json();
};

const del = async (type, route) => {
  const del = await fetch(`${storeRoot}/${route}/delete`, {
    ...fetchOptions,
    method: 'DELETE',
    body: JSON.stringify(type)
  });
  return await del.json();
};

export const sendComponent = async component => send(component, 'component', component.meta.type);
export const deleteComponent = async type => del({type}, 'component');

export const sendTemplate = async template => send(template, 'template', template.meta.type);
export const deleteTemplate = async type => del({type}, 'template');

export const sendContent = async content => send(content, 'content', content.meta.name);
export const deleteContent = async name => del({name}, 'content');

export const sendMedia = async (file, meta, name) => {
  const res = await fetch(`${mediaRoot}/media`, {
    mode: 'cors',
    method: `POST`,
    body: JSON.stringify({
      tags: [],
      name,
      media: file,
      meta
    })
  });
  return await res.json();
};

export const deleteMedia = async filename => {
  const res = await fetch(`${mediaRoot}/media`, {
    headers: {'Content-Type': 'application/json'},
    method: 'DELETE',
    body: JSON.stringify({filename})
  });
  return await res.json();
};

export const queryMedia = async query => {
  const raw = await fetch(`${storeRoot}/media/q/${query}`);
  const list = await raw.json();
  return list.map(item => ({...item, path: `${mediaRoot}/${item.filename}`}));
};

export const getComponentData = async components => {
  const comps = components.split(',');
  const proms = comps.map(comp => get(comp, `component`));
  const data = await Promise.all(proms);
  const val = data.map(item => item[0]);
  return val;
};
