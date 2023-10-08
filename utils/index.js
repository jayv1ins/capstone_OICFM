
exports.encrypt = (payload, shift) => {
  if (typeof payload !== "string") {
    throw new Error('Payload must be string');
  }

  return payload.split('').map(char => {
    if (char.match(/[a-z]/i)) {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        char = String.fromCharCode(((code - 65 + shift ) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        char = String.fromCharCode(((code - 97 + shift ) % 26) + 97);
      }
    }

    return char;
  }).join('');
};

exports.decrypt = (payload) => {
};