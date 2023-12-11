const { MongoClient, ObjectId } = require("mongodb");
const DATABASE_URL =
  "mongodb+srv://majnnakpil:nakpilers@nakpilcluster.ervgh0t.mongodb.net/PNP_management";
const client = new MongoClient(DATABASE_URL);
const db = client.db("PNP_management");
const collection = db.collection("Record");

exports.getHelp = async function (req, res) {
  try {
    await client.connect();
    const db = client.db("PNP_management");
    const collection = db.collection("Record");

    res.render("help", { user: req.user });
  } catch (error) {
    console.error(error);
    await client.close(); // Close the connection
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the data." });
  }
};
