const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


exports.index = (req, res) => {
  res.render('accounts/register', { message: null });
};

exports.register = async (req, res) => {
  const { username, email, password, usertype } = req.body;

  if (username.length < 4) {
    return res.render('register', { message: 'Username should be more than 4 characters long' });
  } else if (password.length < 4) {
    return res.render('register', { message: 'Password must be at least 4 characters long and one uppercase letter, one lowercase letter'});
  } else if (!password.match(/[A-Z]/)) {
    return res.render('register', { message: 'Password must contain at least one uppercase letter' });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email },
        { username: username }
      ]
    }
  });
  if (existingUser) {
    const message = existingUser.email === email ? 'Email already taken' : 'Username already taken';
    return res.render('accounts/register', { message });
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

  const user = await prisma.user.create({
    data: {
      username,
      email,
      usertype,
      password: encryptedPassword,
      shift
    }
  });
  console.log(`Created user with username: ${user.username}`);
  req.session.user = user;
  console.log(req.session.user);
  // res.render('/home', { message: 'User successfully registered' });
  res.redirect("/index");
};
