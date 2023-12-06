const { MongoClient, ObjectId } = require("mongodb");
const DATABASE_URL =
  "mongodb+srv://majnnakpil:nakpilers@nakpilcluster.ervgh0t.mongodb.net/PNP_management";
const client = new MongoClient(DATABASE_URL);
const db = client.db("PNP_management");
const collection = db.collection("Record");

exports.getIndex = async function (req, res) {
  try {
    await client.connect();
    const db = client.db("PNP_management");
    const collection = db.collection("Record");

    const totalGunCount = await collection.countDocuments();

    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed, so add 1
    const currentYear = new Date().getFullYear();
    const lastDay = new Date(currentYear, currentMonth, 0).getDate();
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;

    const NotScanned = await collection.countDocuments({
      archived: false,
      turnOver: {
        $gte: `${currentYear}-01-01`,
        $lte: `${currentYear}-${lastMonth}-${lastDay}`,
      },
    });

    res.render("index", { user: req.user, totalGunCount, NotScanned });
  } catch (error) {
    console.error(error);
    await client.close(); // Close the connection
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the data." });
  }
};
