import fetch from 'node-fetch';

export const dataDomain = `http://api:8001`;

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
