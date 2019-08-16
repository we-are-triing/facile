export const primitives = {
  string: {
    label: 'string',
    definition: 'no formatting, only a string of text',
    handler: 'form-string'
  },
  text: {
    label: 'text',
    definition: 'rich text formatting only inline elements allowed, see text component.',
    handler: 'form-text'
  },
  text_block: {
    label: 'text block',
    definition: 'rich text formatting block elements allowed, see text block component.',
    handler: 'form-text-block'
  },
  number: {
    label: 'number',
    definition: 'a number, could have a decimal, but a typical number.',
    handler: 'form-number'
  },
  boolean: {
    label: 'boolean',
    definition: 'true or false',
    handler: 'form-boolean'
  },
  object: {
    label: 'object',
    definition: 'a json object { prop: value }',
    handler: 'form-object'
  },
  region: {
    label: 'region',
    definition: 'A region that would allow dynamic components as subs to this component',
    handler: 'form-region'
  },
  set: {
    label: 'set',
    definition: 'A finite number of options. This would define the options available.',
    handler: 'form-set'
  },
  list: {
    label: 'list',
    definition: 'an array of a type',
    handler: 'form-list'
  },
  path: {
    label: 'path',
    definition: 'a path to a resource, a url or uri.',
    handler: 'form-path'
  }
};

export const regions = {
  fluid: {
    label: 'fluid',
    definition: 'Allows as many as defined of a set of options in any order.'
  },
  fixed: {
    label: 'fixed',
    definition: 'Allows as many as defined in a set order'
  },
  single: {
    label: 'single',
    definition: 'Allows one of a defined set.'
  },
  static: {
    label: 'static',
    definition: 'Is not editable, the values persist.'
  }
};

const strEsc = str => str.replace(/"/gi, '&quot;');

const mapValues = ({type, name, value = ''}) => ({tag: primitives[type].handler, type, name, value});

export const mapToString = v => {
  const {tag, name, value, type} = mapValues(v);
  if (type === 'region') {
    const {components, region} = v;
    return mapRegionToString({tag, name, components, region, value});
  }
  if (type === 'set') {
    const {set} = v;
    return mapSetToString({tag, name, set, value});
  }
  const escv = strEsc(value);
  return `<${tag}${escv !== '' ? ` value="${escv}"` : ''}>${name}</${tag}>`;
};

export const mapToElement = v => {
  const {tag, name, value, type} = mapValues(v);
  if (type === 'region') {
    const {components, region} = v;
    return mapRegionToElement({tag, name, value, components, region});
  }
  if (type === 'set') {
    const {set} = v;
    return mapSetToElement({tag, name, value, set});
  }
  const elem = document.createElement(tag);
  if (value) {
    elem.value = value;
  }
  elem.textContent = name;
  return elem;
};

export const mapRegionToString = ({tag, name, components, region, value}) => {
  return `<${tag} name="${name}" type="${region}" components="${components.join(',')}"></${tag}>`;
};

export const mapRegionToElement = ({tag, name, components, region, value}) => {
  const elem = document.createElement(tag);
  elem.setAttribute('name', name);
  elem.setAttribute('type', region);
  elem.setAttribute('components', components.join(','));
  return elem;
};
export const mapSetToString = ({tag, name, set, value}) => {
  return `<${tag} label="${name}" value="${value}">
    ${set.map(item => `<option value="${item}">${item}</option>`).join('')}
  </${tag}>`;
};

export const mapSetToElement = ({tag, name, set, value}) => {
  const elem = document.createElement(tag);
  elem.value = value;
  elem.setAttribute('label', name);
  elem.innerHTML = set.map(item => `<option value="${item}">${item}</option>`);
  return elem;
};
