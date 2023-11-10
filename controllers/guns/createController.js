const { MongoClient, ObjectId } = require("mongodb");
const DATABASE_URL =
  "mongodb+srv://majnnakpil:nakpilers@nakpilcluster.ervgh0t.mongodb.net/PNP_management";
const client = new MongoClient(DATABASE_URL);
const db = client.db("PNP_management");
const collection = db.collection("Record");

exports.getCreate = (req, res) => {
  res.render("guns/create", { user: req.user });
};

exports.postCreate = async (req, res) => {
  const {
    Gtype,
    Gname,
    caliber,
    serialN,
    acquisition,
    turnOver,
    returned,
    cost,
    station,
    rank,
    lastName,
    firstName,
    middleName,
    QLFR,
  } = req.body;

  try {
    await client.connect();
    const createdAt = new Date();
    const updatedAt = new Date();
    const NewRegister = await collection.insertOne({
      Gtype: Gtype,
      Gname: Gname,
      caliber: caliber,
      serialN: serialN,
      acquisition: acquisition,
      turnOver: turnOver,
      returned: returned,
      cost: parseInt(cost),
      station: station,
      rank: rank,
      lastName: lastName,
      firstName: firstName,
      middleName: middleName,
      QLFR: QLFR,
      createdAt: createdAt,
      updatedAt: updatedAt,
      archived: false,
    });

    return res.redirect(`/DataTable`);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the data." });
    await client.close();
  }
};
