/**
 * Generates a unique random id
 * consisting of uppercase letters
 * and numbers
 *
 * @param {Int} length
 */
const generateUID = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

// export helper functions
module.exports = {
  generateUID,
};
