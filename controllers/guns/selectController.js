const { MongoClient, ObjectId } = require("mongodb");

const DATABASE_URL =
  "mongodb+srv://majnnakpil:nakpilers@nakpilcluster.ervgh0t.mongodb.net/PNP_management";
const client = new MongoClient(DATABASE_URL);

exports.getSelect = async function (req, res) {
  const id = String(req.params.id);

  try {
    await client.connect();
    const db = client.db("PNP_management");
    const collection = db.collection("Record");

    const data = await collection.findOne(
      {
        _id: new ObjectId(id),
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
          station: true,
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
      station,
      rank,
      lastName,
      firstName,
      middleName,
      QLFR,
    } = data;

    res.render("guns/select", {
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
        station,
        rank,
        lastName,
        firstName,
        middleName,
        QLFR,
      },
    });
    // console.log("Data is:", data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
    await client.close();
  }
};
