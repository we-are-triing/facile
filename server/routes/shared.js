import fetch from 'node-fetch';

export const dataDomain = `http://api:8001`;

export const getSimpleComponentList = async () => {
  const temp = await getComponentList();
  return simplifyComponentList(temp);
};
export const simplifyComponentList = list => list.map(({meta}) => ({icon: meta.icon, type: meta.type, tags: meta.tags}));
export const getComponentList = async () => {
  const raw = await fetch(`${dataDomain}/content/components`);
  return raw.json();
};

export const getTemplateList = async () => {
  const raw = await fetch(`${dataDomain}/content/templates`);
  return raw.json();
};

export const getContentList = async () => {
  const raw = await fetch(`${dataDomain}/content`);
  return raw.json();
};
