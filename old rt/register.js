var express = require('express');
var router = express.Router();
var { PrismaClient } = require('@prisma/client');

var prisma = new PrismaClient();

router.get('/', async function (req, res) {
    res.render('register', { message: null });
  });
  
  
router.post('/', async function (req, res) {
const { username, email, password, usertype } = req.body;

try {
    const existingUser = await prisma.user.findFirst({
    where: {
        OR: [
        { email: email },
        { username: username }
        ]
    }
    });
    if (existingUser) {
    if (existingUser.email === email) {
        return res.render('register', { message: 'Email already taken' });
    } else if (existingUser.username === username) {
        return res.render('register', { message: 'Username already taken' });
    }
    } else if (!passwordRegex.test(password)) {
    return res.render('register', { message: 'Password must be at least 4 characters long and contain at least one number, one lowercase letter, one uppercase letter, and one special character' });
    } else if (username.length < 4) {
    return res.render('register', { message: 'Username should be more than 4 characters long' });
    } else {
    // Generate a random shift between 1 and 25
    const shift = Math.floor(Math.random() * 25) + 1;

    // Convert password to array of characters
    const chars = password.split('');

    // Encrypt password using Caesar cipher
    const encryptedChars = chars.map(char => {
        if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        // char = String.fromCharCode(code + shift); it wont work with Capital letter thats why I use the ASCII codes for combine lowercase and uppercase
        // for uppercase password
        if (code >= 65 && code <= 90) {
            char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
            //lower case password 
        } else if (code >= 97 && code <= 122) {
            char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
        }
        }
        return char;
    });

    // Convert encrypted characters back to string
    const encryptedPassword = encryptedChars.join('');

    // Save encrypted password to database
    const user = await prisma.user.create({
        data: {
        username: username,
        email: email,
        usertype: usertype,
        password: encryptedPassword,
        shift: shift
        }
    });
    res.render('home', { message: 'User successfully registered' });
    console.log(`Created user with username: ${user.username}`);
    }
} catch (error) {
    console.error(error);
    res.render('register', { message: 'Error registering user' });
}
});
module.exports = router;
