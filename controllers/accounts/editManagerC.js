const { MongoClient, ObjectId } = require("mongodb");
const DATABASE_URL =
  "mongodb+srv://majnnakpil:nakpilers@nakpilcluster.ervgh0t.mongodb.net/PNP_management";
const client = new MongoClient(DATABASE_URL);

//Decrypt the password using the shift value from the database then pass it to the view/getEdit function
function decryptCaesar(encryptedPassword, shift) {
  const chars = encryptedPassword.split("");
  const decryptedChars = chars.map((char) => {
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
  return decryptedChars.join("");
}

exports.getEdit = async function (req, res) {
  try {
    await client.connect();
    const db = client.db("PNP_management");
    const collection = db.collection("User");
    const user = req.user;
    const id = String(req.params.id);
    const data = await collection.findOne(
      {
        _id: new ObjectId(id), // Use ObjectId with id variable
      },
      {
        projection: {
          id: true,
          email: true,
          lastName: true,
          firstName: true,
          middleName: true,
          QLFR: true,
          policeId: true,
          rank: true,
          office: true,
          usertype: true,
          password: true,
          shift: true,
        },
      }
    );

    if (!data) {
      return res.status(404).send("Data not found");
    }

    const {
      office,
      rank,
      email,
      lastName,
      firstName,
      middleName,
      QLFR,
      usertype,
      policeId,
      password,
      shift,
    } = data;

    // Decrypt the password using the shift value from the database
    const decryptedPassword = decryptCaesar(password, shift);

    return res.render("accounts/admin/edit", {
      user: req.user,
      data: {
        id,
        email,
        office,
        rank,
        lastName,
        firstName,
        middleName,
        QLFR,
        usertype,
        policeId,
        password: decryptedPassword,
        shift,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("The data is not rendering " + error.message);
  }
};

//Encrypt the password using the new shift value then pass it to the controller/updatedData function to encrypt the new password
function encryptCaesar(text, shift) {
  const chars = text.split("");
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
  return encryptedChars.join("");
}

exports.updatedData = async function (req, res) {
  const id = String(req.params.id);
  const {
    email,
    office,
    rank,
    lastName,
    firstName,
    middleName,
    QLFR,
    usertype,
    policeId,
    password,
  } = req.body;

  try {
    await client.connect();
    const db = client.db("PNP_management");
    const collection = db.collection("User");
    const data = await collection.findOne(
      {
        _id: new ObjectId(id), // Use ObjectId with id variable
      },
      {
        projection: {
          id: true,
          email: true,
          lastName: true,
          firstName: true,
          middleName: true,
          QLFR: true,
          policeId: true,
          rank: true,
          office: true,
          usertype: true,
          password: true,
          shift: true,
        },
      }
    );
    if (!data) {
      res.render(`accounts/admin/edit/${id}`, {
        user: req.user,
        ErrorMessage: "Error",
      });
    }

    // Retrieve the current shift value from the database
    const currentShift = data.shift;

    // Generate a new shift value using random number
    const newShift = Math.floor(Math.random() * 25) + 1;

    // Encrypt the new password get from the encryption formula above and new shift value then pass it to the database
    const encryptedPassword = encryptCaesar(password, newShift);

    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed, so add 1
    const currentYear = new Date().getFullYear();
    const currentDay = new Date().getDate();

    const formattedDay = String(currentDay).padStart(2, "0");

    const updatedAt = `${currentYear}-${currentMonth}-${formattedDay}`;
    const updatedData = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
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
          shift: newShift,
          updatedAt: updatedAt,
        },
      }
    );
    // Update the user details in the req.user object

    res.render("accounts/editManager", {
      user: {
        ...user,
        updatedData,
        data: {
          id,
          email,
          lastName,
          firstName,
          middleName,
          QLFR,
          policeId,
          rank,
          office,
          usertype,
        },
        SuccessMessage: "Data updated successfully",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("The Data updated failed: " + error.message);
    await client.close();
  }
};
