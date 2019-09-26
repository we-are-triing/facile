const fetchOptions = {
  headers: {'Content-Type': 'application/json'}
};

const get = async (type, route) => {
  const temp = await fetch(`/proxy/${route}/${type}`);
  return temp.json();
};

const send = async (item, route, id) => {
  const temp = await fetch(`/proxy/${route}/${id}`, fetchOptions);
  const result = await temp.json();
  const isUpdate = result.length > 0;

  let path = `/proxy/${route}/create`;
  if (isUpdate) {
    path = `/proxy/${route}/update`;
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
  const del = await fetch(`/proxy/${route}/delete`, {
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
  const res = await fetch(`/proxy/media`, {
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
  const res = await fetch(`/proxy/media`, {
    headers: {'Content-Type': 'application/json'},
    method: 'DELETE',
    body: JSON.stringify({filename})
  });
  return await res.json();
};

export const queryMedia = async query => {
  const raw = await fetch(`/proxy/media/${query}`);
  const list = await raw.json();
  return list.map(item => ({...item, path: `/proxy/static/media/${item.filename}`}));
};

export const getComponentData = async components => {
  const comps = components.split(',');
  const proms = comps.map(comp => get(comp, `component`));
  const data = await Promise.all(proms);
  const val = data.map(item => item[0]);
  return val;
};

export const initSite = async ({org, id, secret}) => {
  const res = await fetch(`/admin/init`, {
    method: `POST`,
    body: JSON.stringify({org, id, secret})
  });
  return await res.json();
};

export const loginUser = async token => {
  const res = await fetch(`/api/login`, {
    method: `POST`,
    body: JSON.stringify({token})
  });
  const temp = await res.json();
  return temp;
};

export const registerUser = async ({token, name, email, img, roles, admin, translator}) => {
  const res = await fetch(`/api/register`, {
    method: `POST`,
    body: JSON.stringify({token, profile: {name, email, img}, roles, admin, translator})
  });
  const temp = await res.json();
  return temp;
};
