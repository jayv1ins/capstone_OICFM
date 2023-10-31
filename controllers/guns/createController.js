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

  // Validation code
  if (lastName.length < 3 || firstName.length < 3 || middleName.length < 3) {
    return res.render("guns/create", {
      ErrorMessage: "Names should be more than 3 characters long",
    });
  }

  if (
    !lastName.match(/^[A-Za-z\u4E00-\u9FFF]+$/) ||
    !firstName.match(/^[A-Za-z\u4E00-\u9FFF]+$/) ||
    !middleName.match(/^[A-Za-z\u4E00-\u9FFF]+$/)
  ) {
    return res.render("guns/create", {
      ErrorMessage: "Only alphabetic or logographic characters",
    });
  }

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

    return res.redirect(`/select/${NewRegister.insertedId}`);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the data." });
    await client.close();
  }
};
