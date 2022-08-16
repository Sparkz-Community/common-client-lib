/*!
 * Enum validator
 * (c) 2021 IonRev Development, MIT License
 * @param  {Array}    values List of Strings
 * @param  {String}   str the string to compare
 * @return {Boolean}  true or false
 */
// export const enumValues = (values = []) => (str) => values.indexOf(str) !== -1;

export default function enumValues(values) {
  console.log('values:', values);
  return function (str) {
    console.log('str:', str);
    return values.indexOf(str) !== -1;
  };
};
