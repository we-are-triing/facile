export const primitives = {
  string: {
    label: 'string',
    definition: 'no formatting, only a string of text'
  },
  text: {
    label: 'text',
    definition: 'rich text formatting only inline elements allowed, see text component.'
  },
  text_block: {
    label: 'text block',
    definition: 'rich text formatting block elements allowed, see text block component.'
  },
  number: {
    label: 'number',
    definition: 'a number, could have a decimal, but a typical number.'
  },
  boolean: {
    label: 'boolean',
    definition: 'true or false'
  },
  object: {
    label: 'object',
    definition: 'a json object { prop: val }'
  },
  region: {
    label: 'region',
    definition: 'A region that would allow dynamic components as subs to this component'
  },
  set: {
    label: 'set',
    definition: 'A finite number of options. This would define the options available.'
  },
  list: {
    label: 'list',
    definition: 'an array of a type'
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
