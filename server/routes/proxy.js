import fetch from 'node-fetch';
export const dataDomain = `http://api:8001`;
export const mediaDomain = `http://media:8002`;

const proxy = async (res, type = false) => {
  const {method, params, payload} = res;
  let path = `${dataDomain}/${params.route}/${params.type}`;

  if (type === 'media') {
    path = `${mediaDomain}/media`;
  }
  if (type === 'media query') {
    path = `${dataDomain}/media/q/${params.query}`;
  }
  if (type === 'init') {
    path = `${dataDomain}/admin/init`;
    //Setup the cookie token!
  }
  const m = method.toUpperCase();
  const obj = {
    headers: {'Content-Type': 'application/json'},
    method: m
  };

  if (m === 'POST' || m === 'DELETE') {
    obj.body = JSON.stringify({...payload});
  }

  const raw = await fetch(path, obj);
  const temp = await raw.json();
  return temp;

  /*
${dataDomain}/${route}/${type} // GET
${storeRoot}/${route}/create // POST
${storeRoot}/${route}/update // POST
${storeRoot}/${route}/delete // DELETE
path = `${dataDomain}/q/${params.query}`;
${storeRoot}/admin/init` // POST
*/

  /*
${storeRoot}/media/q/${query} // GET
${mediaRoot}/media` // POST
${mediaRoot}/media` // DELETE
  */
};

export default server => {
  server.route([
    {
      method: [`GET`, `POST`, `DELETE`],
      path: `/proxy/{route}/{type}`,
      options: {
        description: `proxy for…`,
        notes: `proxy for…`,
        tags: [`api`]
      },
      handler: proxy
    },
    {
      method: `GET`,
      path: `/proxy/media/{query}`,
      options: {
        description: `proxy for…`,
        notes: `proxy for…`,
        tags: [`api`]
      },
      handler: res => proxy(res, 'media query')
    },
    {
      method: `GET`,
      path: `/proxy/static/media/{path}`,
      options: {
        description: `proxy for…`,
        notes: `proxy for…`,
        tags: [`api`]
      },
      handler: async (res, h) => {
        const raw = await fetch(`${mediaDomain}/${res.params.path}`);
        const blob = await raw.blob();
        const buff = await blob.arrayBuffer();
        const media = Buffer(new Uint8Array(buff));
        return h
          .response(media)
          .type(blob.type)
          .bytes(buff.length);
      }
    },
    {
      method: [`POST`, `DELETE`],
      path: `/proxy/media`,
      options: {
        description: `proxy for…`,
        notes: `proxy for…`,
        tags: [`api`]
      },
      handler: res => proxy(res, 'media')
    },
    {
      method: [`POST`],
      path: `/proxy/admin/init`,
      options: {
        description: `proxy for…`,
        notes: `proxy for…`,
        tags: [`api`]
      },
      handler: res => proxy(res, 'init')
    }
  ]);
};
