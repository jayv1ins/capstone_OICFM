var express = require('express');
var router = express.Router();
var { PrismaClient } = require('@prisma/client');

var prisma = new PrismaClient();
router.get('/:id', async function (req, res) {
    const id = parseInt(req.params.id);
  
    try {
      const data = await prisma.data.findUnique({
        where: {
          id: id,
        },
      });
  
      if (!data) {
        return res.status(404).send('Data not found');
      }
  
      const { keyA, keyB, lastName, firstName, middleName, gender, birthdate, hobbies, address, zip, civilStatus } = data;
  
      const findModInverse = (a, m) => {
        const g = gcd(a, m);
        if (g !== 1) {
          throw new Error('Inverse does not exist.');
        }
        return mod(a, m);
      };
  
      const mod = (n, m) => {
        return ((n % m) + m) % m;
      };
  
      const affineDecrypt = (str, keyA, keyB) => {
        let result = '';
        const modInvA = findModInverse(keyA, 26);
        for (let i = 0; i < str.length; i++) {
          const charCode = str.charCodeAt(i);
          if (charCode >= 65 && charCode <= 90) { // uppercase letters
            const decryptedCharCode = (modInvA * (charCode + 26 - 65 - keyB)) % 26 + 65;
            result += String.fromCharCode(decryptedCharCode);
          } else if (charCode >= 97 && charCode <= 122) { // lowercase letters
            const decryptedCharCode = (modInvA * (charCode + 26 - 97 - keyB)) % 26 + 97;
            result += String.fromCharCode(decryptedCharCode);
          } else {
            result += str[i];
          }
        }
        return result;
      };
  
      const decryptedLastName = affineDecrypt(lastName, keyA, keyB);
      const decryptedFirstName = affineDecrypt(firstName, keyA, keyB);
  
      const viewData = {
        id,
        keyA,
        keyB,
        lastName: decryptedLastName,
        firstName: decryptedFirstName,
        middleName,
        gender,
        birthdate,
        hobbies,
        address,
        zip,
        civilStatus,
      };
  
      res.render('select', { title: 'Data Details', data: viewData });
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred');
    }
  });
  