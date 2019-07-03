const storeRoot = `http://localhost:8001`;
const fetchOptions = {
  mode: 'cors',
  headers: {'Content-Type': 'application/json'}
};

const send = async (item, compOrTemplate) => {
  const temp = await fetch(`${storeRoot}/content/${compOrTemplate}/${item.meta.type}`, fetchOptions);
  const result = await temp.json();
  const isUpdate = result.length > 0;

  let path = `${storeRoot}/content/${compOrTemplate}/create`;
  if (isUpdate) {
    path = `${storeRoot}/content/${compOrTemplate}/update/${item.meta.type}`;
  }
  const body = JSON.stringify(item);

  const resp = await fetch(path, {
    ...fetchOptions,
    method: 'POST',
    body
  });

  return resp;
};

const del = async (type, compOrTemplate) => {
  const del = await fetch(`${storeRoot}/content/${compOrTemplate}/delete`, {
    ...fetchOptions,
    method: 'DELETE',
    body: JSON.stringify({type})
  });
  return del;
};

export const sendComponent = async component => send(component, 'component');
export const sendTemplate = async template => send(template, 'template');

export const deleteComponent = async type => del(type, 'component');
export const deleteTemplate = async type => del(type, 'template');
