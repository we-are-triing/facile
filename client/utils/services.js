const storeRoot = `http://localhost:8001`;
const fetchOptions = {
  mode: 'cors',
  headers: {'Content-Type': 'application/json'}
};
export const sendComponent = async component => {
  const comp = await fetch(`${storeRoot}/content/component/${component.meta.type}`, fetchOptions);
  const result = await comp.json();
  const isUpdate = result.length > 0;

  let path = `${storeRoot}/content/component/create`;
  if (isUpdate) {
    path = `${storeRoot}/content/component/update/${component.meta.type}`;
  }
  const body = JSON.stringify(component);

  const resp = await fetch(path, {
    ...fetchOptions,
    method: 'POST',
    body
  });
  console.log(resp);
};
