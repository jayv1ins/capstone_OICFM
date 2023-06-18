const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getSelect = async function (req, res) {
  const id = String(req.params.id);

    const data = await prisma.data.findUnique({
      where: { id },
      select: {
        id: true,
        keyA: true,
        keyB: true,
        lastName: true,
        firstName: true,
        middleName: true,
        gender: true,
        birthdate: true,
        hobbies: true,
        address: true,
        zip: true,
        civilStatus: true,
      },
    });
    if (!data) {
      res.status(404).send("Data not found");
    } else {
      const { id, keyA, keyB, lastName, firstName, middleName, gender, birthdate, hobbies, address, zip, civilStatus } = data;
      const affineEncrypt = (str) => {
        let result = '';
        for (let i = 0; i < str.length; i++) {
          const charCode = str.charCodeAt(i);
          if (charCode >= 65 && charCode <= 90) { // uppercase letters
            const encryptedCharCode = (keyA * (charCode - 65) + keyB) % 26 + 65;
            result += String.fromCharCode(encryptedCharCode);
          } else if (charCode >= 97 && charCode <= 122) { // lowercase letters
            const encryptedCharCode = (keyA * (charCode - 97) + keyB) % 26 + 97;
            result += String.fromCharCode(encryptedCharCode);
          } else {
            result += str[i];
          }
        }
        return result;
      };
      const encryptedLastName = affineEncrypt(lastName, keyA, keyB);
      const encryptedFirstName = affineEncrypt(firstName, keyA, keyB);
      const editedData = {
        id,
        keyA,
        keyB,
        lastName: encryptedLastName,
        firstName: encryptedFirstName,
        middleName,
        gender,
        birthdate,
        hobbies,
        address,
        zip,
        civilStatus,
      };
      res.render("select", { title: "Edit Data", data: editedData });
    }

};


// Find the multiplicative inverse of a modulo m
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

