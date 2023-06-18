const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getHome = async function(req, res) {
    const data = await prisma.data.findMany();
    const datas = data.map((row) => {
      const {id, keyA, keyB, lastName, firstName, middleName, gender, birthdate, hobbies, address, zip, civilStatus } = row;
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
      const decryptedLastName = affineDecrypt(lastName, keyA, keyB);
      const decryptedFirstName = affineDecrypt(firstName, keyA, keyB);
      return {
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
    });
    res.render('home', { title: 'Express', datas: datas, user: req.user  });
};

function findModInverse(a, m) {
  const g = gcd(a, m);
  if (g !== 1) {
    throw new Error('Inverse does not exist.');
  }
  return mod(a, m);
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

  

function generateCoPrime() {
  let num;
  do {
    num = Math.floor(Math.random() * 26);
  } while (gcd(num, 26) !== 1);
  return num;
}

function gcd(keyA, keyB) {
  if (keyB === 0) {
    return keyA;
  } else {
    return gcd(keyB, keyA % keyB);
  }
}
  
exports.postHome = async (req, res) => {
  const { lastName, firstName, middleName, gender, birthdate, hobbies, address, zip, civilStatus } = req.body;

  // Generate random key values
  const keyA = generateCoPrime();
  const keyB = Math.floor(Math.random() * 26);

  // Affine encryption function
  const affineEncrypt = (str) => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode >= 65 && charCode <= 90) {  // uppercase letters
        const encryptedCharCode = ((keyA * (charCode - 65)) + keyB) % 26 + 65;
        result += String.fromCharCode(encryptedCharCode);
      } else if (charCode >= 97 && charCode <= 122) {  // lowercase letters
        const encryptedCharCode = ((keyA * (charCode - 97)) + keyB) % 26 + 97;
        result += String.fromCharCode(encryptedCharCode);
      } else {
        result += str[i];
      }
    }
    return result;
  };

  // Perform encryption on lastName and firstName fields
  const encryptedLastName = affineEncrypt(lastName);
  const encryptedFirstName = affineEncrypt(firstName);

    const result = await prisma.data.create({
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

    res.redirect("/home"); // Redirect to the home page or any desired location);

 
};


exports.deleteData = async function(req, res) {
  const id = String(req.params.id);

    // Retrieve the existing data
    const existingData = await prisma.data.findUnique({
      where: { id: id },
    });

    if (existingData == null) {
      res.status(404).send("Data not found");
    } else {
      // Delete the data
      await prisma.data.delete({
        where: { id: id },
      });

      res.redirect("/home"); // Redirect to the home page or any desired location
    }
 
};
