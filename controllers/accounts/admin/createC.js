const { PrismaClient } = require('@prisma/client');
const { sendManagerCredentials } = require('../../../public/javascript/mail'); // Import the email function

const prisma = new PrismaClient();


exports.index = (req, res) => {
  res.render('accounts/admin/create', { message: null, user: req.user });
};

exports.postCreate = async (req, res) => {
  const { email,station, rank, lastName, firstName, middleName, QLFR, password, usertype, policeId} = req.body;

  if (firstName.length < 3) {
    return res.render('register', { ErrorMessage: 'Username should be more than 4 characters long' });
  } else if (password.length < 4) {
    return res.render('register', { ErrorMessage: 'Password must be at least 4 characters long and one uppercase letter, one lowercase letter'});
  } else if (!password.match(/[A-Z]/)) {
    return res.render('register', { ErrorMessage: 'Password must contain at least one uppercase letter' });
  }

  const existingUser = await prisma.UserTest.findFirst({
    where: {
      OR: [
        { policeId: policeId }
      ]
    }
  });
  if (existingUser) {
    const message = existingUser.policeId === policeId ? 'Police Id Nmber already taken' : null;
    return res.render('accounts/admin/create', { ErrorMessage });
  }

  const shift = Math.floor(Math.random() * 25) + 1;
  const chars = password.split('');
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
  const encryptedPassword = encryptedChars.join('');

  const user = await prisma.UserTest.create({
    data: {
      email,
      lastName,
      firstName,
      middleName,
      QLFR,
      policeId,
      rank,
      station,
      usertype,
      password: encryptedPassword,
      shift
    },
  });
  sendManagerCredentials(email, policeId, password); // Adjust arguments as needed
  console.log("email sent successfully",sendManagerCredentials);
  console.log(`Created user with police id number: ${user.policeId}`);
  // res.render('/home', { message: 'User successfully registered' });
  res.render("accounts/admin/table", { SuccessMessage: 'User successfully registered', user: req.user});
};
