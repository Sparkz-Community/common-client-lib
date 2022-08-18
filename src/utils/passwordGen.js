export default function passwordGenerator(
  {
    length = 10,
    alpha = 'abcdefghijklmnopqrstuvwxyz',
    numeric = '0123456789',
    punctuation = '!@#$%^&*()_+~`|}{[]:;?><,./-=',
  } = {}
) {
  let password = '';
  let character = '';
  while (password.length < length) {
    let entity1 = Math.ceil(alpha.length * Math.random() * Math.random());
    let entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
    let entity3 = Math.ceil(punctuation.length * Math.random() * Math.random());
    let hold = alpha.charAt(entity1);
    hold = (password.length % 2 == 0) ? (hold.toUpperCase()) : (hold);
    character += hold;
    character += numeric.charAt(entity2);
    character += punctuation.charAt(entity3);
    password = character;
  }
  password = password.split('').sort(function () {
    return 0.5 - Math.random();
  }).join('');
  return password.substr(0, length);
};
