import CompareUtils from './CompareUtils';
import diff from './diff';
import passwordGen from './passwordGen';
import isEmpty from './isEmpty';
import enumValues from './EnumValues';
import {slot, mergeSlot, uniqueSlot, mergeSlotSafely} from './slot';

const singularize  = function(word) {
  const endings = {
    ves: 'fe',
    ies: 'y',
    i: 'us',
    zes: '',
    ses: '',
    // es: '',
    s: ''
  };
  return word.replace(
    new RegExp(`(${Object.keys(endings).join('|')})$`),
    r => endings[r]
  );
};

const kebabize = str => {
  return str.split('').map((letter, idx) => {
    return letter.toUpperCase() === letter
      ? `${idx !== 0 ? '-' : ' '}${letter.toLowerCase()}`
      : letter;
  }).join('');
};

const capitalize = (str) => {
  if (typeof str !== 'string') return '';
  const lowecaseStrArray = kebabize(str).replace('-','').split(' ').map(s=>s.charAt(0).toUpperCase() + s.slice(1));
  return lowecaseStrArray.join(' ');
};

const camelCasize = function(str) {
  return str
    .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
    .replace(/\s/g, '')
    .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
};


export {
  CompareUtils,
  diff,
  passwordGen,
  isEmpty,
  enumValues,
  slot,
  mergeSlot,
  uniqueSlot,
  mergeSlotSafely,
  singularize,
  capitalize,
  kebabize,
  camelCasize
};
