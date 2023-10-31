const { MongoClient } = require("mongodb");
const DATABASE_URL =
  "mongodb+srv://majnnakpil:nakpilers@nakpilcluster.ervgh0t.mongodb.net/PNP_management";
const client = new MongoClient(DATABASE_URL);
const db = client.db("PNP_management");
const collection = db.collection("User");

exports.index = (req, res) => {
  res.render("accounts/login");
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    try {
      await client.connect();
      // await client.close();

      const user = await collection.findOne({ email });
      // console.log("email", email);
      if (user) {
        // console.log("email", email);
        const { shift, password: encryptedPassword } = user;

        // Decrypt the password using the shift value
        const chars = password.split("");
        const cryptedChars = chars.map((char) => {
          if (char.match(/[a-z]/i)) {
            const Encrypt = char.charCodeAt(0);
            if (Encrypt >= 65 && Encrypt <= 90) {
              char = String.fromCharCode(((Encrypt - 65 + shift) % 26) + 65);
            } else if (Encrypt >= 97 && Encrypt <= 122) {
              char = String.fromCharCode(((Encrypt - 97 + shift) % 26) + 97);
            }
          }
          return char;
        });

        const cryptedPassword = cryptedChars.join("");

        // Check if the decrypted password matches the one in the database
        // console.log("Decrypted password:", cryptedPassword);
        // console.log("Stored password:", encryptedPassword);

        if (cryptedPassword === encryptedPassword) {
          req.session.user = user;
          // console.log("Email is:", user.email);
          // console.log(req.session.user);
          res.redirect("/index"); // Redirect to the home page or any desired location
        } else {
          res.render("accounts/login", { errorMessage: "Incorrect Password!" });
        }
      } else {
        res.render("accounts/login", { errorMessage: "Email does not exist!" });
      }
    } catch {
      await client.close();
    }
  }
};
