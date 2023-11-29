const { MongoClient, ObjectId } = require("mongodb");
const DATABASE_URL =
  "mongodb+srv://majnnakpil:nakpilers@nakpilcluster.ervgh0t.mongodb.net/PNP_management";
const client = new MongoClient(DATABASE_URL);

exports.getEdit = async function (req, res) {
  const id = String(req.params.id);

  try {
    await client.connect();
    const db = client.db("PNP_management");
    const collection = db.collection("Record");

    const data = await collection.findOne(
      {
        _id: new ObjectId(id), // Use ObjectId with id variable
      },
      {
        projection: {
          id: true,
          Gtype: true,
          Gname: true,
          caliber: true,
          serialN: true,
          acquisition: true,
          turnOver: true,
          returned: true,
          cost: true,
          office: true,
          rank: true,
          lastName: true,
          firstName: true,
          middleName: true,
          QLFR: true,
        },
      }
    );

    if (!data) {
      return res.status(404).send("Data not found");
    }

    const {
      Gtype,
      Gname,
      caliber,
      serialN,
      acquisition,
      turnOver,
      returned,
      cost,
      office,
      rank,
      lastName,
      firstName,
      middleName,
      QLFR,
    } = data;

    return res.render("guns/edit", {
      user: req.user,
      data: {
        id,
        Gtype,
        Gname,
        caliber,
        serialN,
        acquisition,
        turnOver,
        returned,
        cost,
        office,
        rank,
        lastName,
        firstName,
        middleName,
        QLFR,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
    await client.close();
  }
};

exports.updatedData = async function (req, res) {
  const id = String(req.params.id);
  const {
    Gtype,
    Gname,
    caliber,
    serialN,
    acquisition,
    turnOver,
    returned,
    cost,
    office,
    rank,
    lastName,
    firstName,
    middleName,
    QLFR,
  } = req.body;

  try {
    await client.connect();
    const db = client.db("PNP_management");
    const collection = db.collection("Record");
    const updatedAt = new Date();
    const updatedData = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          Gtype: Gtype,
          Gname: Gname,
          caliber: caliber,
          serialN: serialN,
          acquisition: acquisition,
          turnOver: turnOver,
          returned: returned,
          cost: parseInt(cost),
          office: office,
          rank: rank,
          lastName: lastName,
          firstName: firstName,
          middleName: middleName,
          QLFR: QLFR,
          updatedAt: updatedAt,
        },
      }
    );

    res.redirect("/DataTable");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
    await client.close();
  }
};
