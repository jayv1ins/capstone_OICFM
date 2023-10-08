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
  try {
    const user = req.user;

    // Decrypt the password using the shift value from the user object
    const decryptedPassword = decryptCaesar(user.password, user.shift);

    return res.render("accounts/editManager", {
      user: {
        ...user,
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
  const { username, email, usertype, password } = req.body;

  try {
    // Generate a new shift value using random number
    const newShift = Math.floor(Math.random() * 25) + 1;

    // Encrypt the new password using the new shift value
    const encryptedPassword = encryptCaesar(password, newShift);

    // Update user details in the database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username,
        email,
        usertype,
        password: encryptedPassword,
        shift: newShift,
      },
      select: {
        id: true,
        username: true,
        email: true,
        usertype: true,
        password: true,
        shift: true,
      },
    });

    // Update the user details in the req.user object
    Object.assign(req.user, updatedUser);

    res.redirect(`/profile/${id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
