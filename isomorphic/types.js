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
    definition: 'a json object { prop: val }',
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

const mapValues = ({type, name, val = ''}) => ({tag: primitives[type].handler, type, name, val});

export const mapToString = v => {
  const {tag, name, val, type} = mapValues(v);
  if (type === 'region') {
    const {components, region} = v;
    return mapRegionToString({tag, name, val, components, region});
  }
  return `<${tag}${val !== '' ? ` value="${val}"` : ''}>${name}</${tag}>`;
};

export const mapToElement = v => {
  const {tag, name, val, type} = mapValues(v);
  if (type === 'region') {
    const {components, region} = v;
    return mapRegionToElement({tag, name, val, components, region});
  }
  const elem = document.createElement(tag);
  if (val) {
    elem.setAttribute('value', val);
  }
  elem.textContent = name;
  return elem;
};

export const mapRegionToString = ({tag, name, val, components, region}) => {
  return `<${tag} name="${name}" type="${region}" components="${components.join(',')}"></${tag}>`;
};

export const mapRegionToElement = ({tag, name, val, components, region}) => {
  const elem = document.createElement(tag);
  elem.setAttribute('name', name);
  elem.setAttribute('type', region);
  elem.setAttribute('components', components.join(','));
  return elem;
};
