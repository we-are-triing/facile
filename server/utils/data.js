import fetch from 'node-fetch';

export const dataDomain = `http://api:8001`;
export const mediaDomain = `http://media:8002`;

export const getSimpleComponentList = async () => {
  const temp = await getComponentList();
  return simplifyComponentList(temp);
};
export const simplifyComponentList = list => list.map(({meta}) => ({icon: meta.icon, type: meta.type, tags: meta.tags}));
export const getComponentList = async () => {
  const raw = await fetch(`${dataDomain}/components`);
  return raw.json();
};

export const getTemplateList = async () => {
  const raw = await fetch(`${dataDomain}/templates`);
  return raw.json();
};

export const getTemplateByType = async type => {
  const raw = await fetch(`${dataDomain}/template/${type}`);
  const template = await raw.json();
  return template[0];
};

export const getComponentByType = async type => {
  const raw = await fetch(`${dataDomain}/component/${type}`);
  const template = await raw.json();
  return template[0];
};

export const getContentList = async () => {
  const raw = await fetch(`${dataDomain}/content`);
  const content = await raw.json();
  return content.map(({meta}) => ({...meta}));
};
export const getContentByName = async name => {
  const raw = await fetch(`${dataDomain}/content/${name}`);
  const content = await raw.json();
  return content[0];
};

const getFilteredList = async id => {
  const raw = await fetch(`${dataDomain}/media`);
  const content = await raw.json();
  // TODO: this would be faster through mongo.
  const filtered = content.filter(item => item.master === id);
  return filtered.map(({filename, tags, name}) => ({filename, tags, name}));
};

export const queryMedia = async query => {
  const raw = await fetch(`${dataDomain}/media/q/${query}`);
  return await raw.json();
};

export const getMediaList = async () => getFilteredList('self');
export const getDerivativeMedia = async filename => getFilteredList(filename);

export const getMediaByFilename = async filename => {
  const raw = await fetch(`${dataDomain}/media/${filename}`);
  const content = await raw.json();
  return content[0];
};
