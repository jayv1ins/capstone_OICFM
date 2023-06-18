var express = require('express');
var router = express.Router();
var { PrismaClient } = require('@prisma/client');

var prisma = new PrismaClient();

router.get('/', async function (req, res) {
    res.render('login');
});

router.post('/', async function (req, res) {
    const { email, password } = req.body;
  
    if (email && password) {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
  
        if (user) {
          const { shift, password: encryptedPassword } = user;
  
          // Decrypt the password using the shift value
          const chars = password.split('');
          const cryptedChars = chars.map(char => {
            if (char.match(/[a-z]/i)) {
              const Encrypt = char.charCodeAt(0);
              if (Encrypt >= 65 && Encrypt <= 90) {
                char = String.fromCharCode(((Encrypt - 65 + shift ) % 26) + 65);
              } else if (Encrypt >= 97 && Encrypt <= 122) {
                char = String.fromCharCode(((Encrypt - 97 + shift ) % 26) + 97);
              }
            }
            return char;
          });
  
          const cryptedPassword = cryptedChars.join('');
  
          // Check if the decrypted password matches the one in the database
          console.log('Decrypted password:', cryptedPassword);
          console.log('Stored password:', encryptedPassword);
          if (cryptedPassword === encryptedPassword) {
            res.render('home');
          } else {
            res.render('login', { errorMessage: 'Incorrect Password!' });
          }
        } else {
          res.render('login', { errorMessage: 'Email does not exist!' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to find user" });
      }
    }
});
module.exports = router;
  