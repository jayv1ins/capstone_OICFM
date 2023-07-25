const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



//Decrypt the password using the shift value from the database then pass it to the view/getEdit function
function decryptCaesar(encryptedPassword, shift) {
  const chars = encryptedPassword.split('');
  const decryptedChars = chars.map(char => {
    if (char.match(/[a-z]/i)) {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        char = String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        char = String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
      }
    }
    return char;
  });
  return decryptedChars.join('');
}


exports.getEdit = async function (req, res) {
  const id = String(req.params.id);

  try {
    const data = await prisma.userTest.findUnique({
      where: { id },
      select: {
        id: true,
        lastName: true,
        firstName: true,
        middleName: true,
        QLFR: true,
        policeId: true,
        rank: true,
        station: true,
        usertype: true,
        password: true,
        shift: true,
      },
    });

    if (!data) {
      return res.status(404).send("Data not found");
    }

    const { station, rank, lastName, firstName, middleName, QLFR, usertype, policeId, password, shift } = data;

    // Decrypt the password using the shift value from the database
    const decryptedPassword = decryptCaesar(password, shift);

    return res.render("accounts/admin/edit", {
      data: {
        id,
        station,
        rank,
        lastName,
        firstName,
        middleName,
        QLFR,
        usertype,
        policeId,
        password: decryptedPassword,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
};


//Encrypt the password using the new shift value then pass it to the controller/updatedData function to encrypt the new password
function encryptCaesar(text, shift) {
  const chars = text.split('');
  const encryptedChars = chars.map(char => {
    if (char.match(/[a-z]/i)) {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
    }
    return char;
  });
  return encryptedChars.join('');
}

exports.updatedData = async function (req, res) {
  const id = String(req.params.id);
  const { station, rank, lastName, firstName, middleName, QLFR, usertype, policeId, password } = req.body;

  try {
    const data = await prisma.userTest.findUnique({
      where: { id },
      select: {
        id: true,
        lastName: true,
        firstName: true,
        middleName: true,
        QLFR: true,
        policeId: true,
        rank: true,
        station: true,
        usertype: true,
        password: true,
        shift: true,
      },
    });

    if (!data) {
      return res.status(404).send("Data not found");
    }

    // Retrieve the current shift value from the database
    const currentShift = data.shift;

    // Generate a new shift value using random number
    const newShift = Math.floor(Math.random() * 25) + 1;

    // Encrypt the new password get from the encryption formula above and new shift value then pass it to the database
    const encryptedPassword = encryptCaesar(password, newShift);

    const updatedData = await prisma.userTest.update({
      where: { id },
      data: {
        lastName,
        firstName,
        middleName,
        QLFR,
        policeId,
        rank,
        station,
        usertype,
        password: encryptedPassword,
        shift: newShift,
      },
      select: {
        id: true,
        lastName: true,
        firstName: true,
        middleName: true,
        QLFR: true,
        policeId: true,
        rank: true,
        station: true,
        usertype: true,
      },
    });

    res.redirect(`/admin/edit/${id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};