var express = require('express');
var router = express.Router();
var { PrismaClient } = require('@prisma/client');

var prisma = new PrismaClient();

router.get('/', async function (req, res) {
  try {
    const data = await prisma.data.findMany();
    const datas = data.map((row) => {
      const { id, keyA, keyB, lastName, firstName, middleName, gender, birthdate, hobbies, address, zip, civilStatus } = row;

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

      const affineDecrypt = (str) => {
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

      const decryptedLastName = affineDecrypt(lastName);
      const decryptedFirstName = affineDecrypt(firstName);

      return {
        dataId,
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
    });

    res.render('home', { title: 'Express', datas: datas });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

const generateCoPrime = () => {
  let num;
  do {
    num = Math.floor(Math.random() * 26);
  } while (gcd(num, 26) !== 1);
  return num;
};

const gcd = (keyA, keyB) => {
  if (keyB === 0) {
    return keyA;
  } else {
    return gcd(keyB, keyA % keyB);
  }
};

router.post('/', async (req, res) => {
  const { lastName, firstName, middleName, gender, birthdate, hobbies, address, zip, civilStatus } = req.body;

  const keyA = generateCoPrime();
  const keyB = Math.floor(Math.random() * 26);

  const affineEncrypt = (str) => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode >= 65 && charCode <= 90) {
        const encryptedCharCode = ((keyA * (charCode - 65)) + keyB) % 26 + 65;
        result += String.fromCharCode(encryptedCharCode);
      } else if (charCode >= 97 && charCode <= 122) {
        const encryptedCharCode = ((keyA * (charCode - 97)) + keyB) % 26 + 97;
        result += String.fromCharCode(encryptedCharCode);
      } else {
        result += str[i];
      }
    }
    return result;
  };

  const encryptedLastName = affineEncrypt(lastName);
  const encryptedFirstName = affineEncrypt(firstName);

  try {
    await prisma.data.create({
      data: {
        lastName: encryptedLastName,
        firstName: encryptedFirstName,
        middleName,
        gender,
        birthdate,
        hobbies,
        address,
        zip,
        civilStatus,
        keyA,
        keyB,
      },
    });

    res.render('home');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

module.exports = router;
