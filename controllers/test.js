const encryptedPassword = encryptedChars.join('');

// Get the shift value used during encryption from the database
const shift = results[0].shift;

// Decrypt the password using the shift value
const chars = password.split('');
const decryptedChars = chars.map(char => {
  if (char.match(/[a-z]/i)) {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      char = String.fromCharCode(((code - 65 - shift) % 26 + 26) % 26 + 65);
    } else if (code >= 97 && code <= 122) {
      char = String.fromCharCode(((code - 97 - shift) % 26 + 26) % 26 + 97);
    }
  }
  return char;
});

const decryptedPassword = decryptedChars.join('');
