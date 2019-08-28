import {getComponentByType} from './data.js';
import {mapValues} from '../../isomorphic/types.js';

const strEsc = str => (str ? str.replace(/"/gi, '&quot;') : '');

export const combine = (content, template) => {
  const values = template.values.map(val => {
    if (val.type === 'region') {
      val.value = content.regions.find(region => val.name === region.meta.name).regions;
    } else {
      val.value = content.values[val.name];
    }
    return val;
  });

  return {
    meta: {...template.meta, ...content.meta},
    values
  };
};

export const mapToString = async v => {
  if (v.values) {
    return mapRegionItemToString(v);
  }
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
const mapRegionToString = async ({tag, name, components, region, value}) => {
  let c = '';
  if (value) {
    const contents = await Promise.all(value.map(item => mapToString(item)));
    c = contents.join('');
  }
  return `<${tag} name="${name}" type="${region}" components="${components.join(',')}">
  ${c}
  </${tag}>`;
};
const mapSetToString = ({tag, name, set, value}) => {
  return `<${tag} label="${name}" value="${value}">
    ${set.map(item => `<option value="${item}">${item}</option>`).join('')}
  </${tag}>`;
};
const mapRegionItemToString = async v => {
  const template = await getComponent(v.meta.type);
  const content = combine(v, template);
  let it = '';
  if (content.values) {
    const items = await Promise.all(content.values.map(val => mapToString(val)));
    it = items.join('');
  }
  return `<region-item type="${content.meta.type}" icon="${content.meta.icon}">
  ${it}
  </region-item>`;
};
// TODO: do this isomorphically, Currently get string is server, and element is client.
const getComponent = async type => getComponentByType(type);
