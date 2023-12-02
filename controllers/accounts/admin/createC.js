const { sendManagerCredentials } = require("../../../public/javascript/mail"); // Import the email function
const { MongoClient, ObjectId } = require("mongodb");
const DATABASE_URL =
  "mongodb+srv://majnnakpil:nakpilers@nakpilcluster.ervgh0t.mongodb.net/PNP_management";
const client = new MongoClient(DATABASE_URL);
const db = client.db("PNP_management");
const collection = db.collection("User");

exports.index = (req, res) => {
  res.render("accounts/admin/create", { message: null, user: req.user });
};

exports.postCreate = async (req, res) => {
  const {
    email,
    office,
    rank,
    lastName,
    firstName,
    middleName,
    QLFR,
    password,
    usertype,
    policeId,
  } = req.body;

  if (firstName.length < 3) {
    return res.render("register", {
      ErrorMessage: "Username should be more than 4 characters long",
    });
  } else if (password.length < 4) {
    return res.render("register", {
      ErrorMessage:
        "Password must be at least 4 characters long and one uppercase letter, one lowercase letter",
    });
  } else if (!password.match(/[A-Z]/)) {
    return res.render("register", {
      ErrorMessage: "Password must contain at least one uppercase letter",
    });
  }
  await client.connect();
  const existingUser = await collection.findOne({
    $or: [
      { policeId, archived: false },
      { email, archived: false },
    ],
  });
  if (existingUser) {
    let ErrorMessage;

    if (existingUser.policeId === policeId && existingUser.email === email) {
      ErrorMessage = "Police Id Number and Email are already taken";
    } else if (existingUser.policeId === policeId) {
      ErrorMessage = "Police Id Number already taken";
    } else if (existingUser.email === email) {
      ErrorMessage = "Email already taken";
    }

    res.render("accounts/admin/create", { ErrorMessage, user: req.user });
  }

  const shift = Math.floor(Math.random() * 25) + 1;
  const chars = password.split("");
  const encryptedChars = chars.map((char) => {
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
  const encryptedPassword = encryptedChars.join("");

  const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed, so add 1
  const currentYear = new Date().getFullYear();
  const currentDay = new Date().getDate();

  const createdAt = `${currentYear}-${currentMonth}-${currentDay}`;
  const updatedAt = `${currentYear}-${currentMonth}-${currentDay}`;

  const user = await collection.insertOne({
    email: email,
    lastName: lastName,
    firstName: firstName,
    middleName: middleName,
    QLFR: QLFR,
    policeId: policeId,
    rank: rank,
    office: office,
    usertype: usertype,
    password: encryptedPassword,
    shift: shift,
    createdAt: createdAt,
    updatedAt: updatedAt,
    archived: false,
  });
  const SuccessCreate = "Successfully Registered!";
  return res.redirect(`/admin/edit/${user.insertedId}`);
  sendManagerCredentials(email, policeId, password); // Adjust arguments as needed
  console.log("email sent successfully", sendManagerCredentials);
  console.log(`Created user with police id number: ${user.policeId}`);
  // res.render('/home', { message: 'User successfully registered' });
};
