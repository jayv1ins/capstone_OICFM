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
          //Guns details
          Gtype: true,
          Gname: true,
          caliber: true,
          serialN: true,
          barrel_Length: true,
          weight: true,
          roundCapacity: true,
          action: true,
          cost: true,
          // Trasanction
          acquisition: true,
          turnOver: true,
          returned: true,
          // Officer details
          office: true,
          rank: true,
          lastName: true,
          firstName: true,
          middleName: true,
          QLFR: true,
          email: true,
          phoneNumber: true,
          address: true,
          age: true,
          civilStatus: true,
          gender: true,
          status: true,
        },
      }
    );

    if (!data) {
      return res.status(404).send("Data not found");
    }

    const {
      //Guns details
      Gtype,
      Gname,
      manufacturer,
      caliber,
      serialN,
      barrel_Length,
      weight,
      roundCapacity,
      action,
      cost,

      // Trasanction
      acquisition,
      turnOver,
      returned,
      // Officer details

      office,
      rank,
      lastName,
      firstName,
      middleName,
      QLFR,
      email,
      phoneNumber,
      address,
      age,
      civilStatus,
      gender,
      status,
    } = data;

    return res.render("guns/edit", {
      user: req.user,
      data: {
        id,
        //Guns details
        Gtype,
        Gname,
        caliber,
        serialN,
        barrel_Length,
        weight,
        roundCapacity,
        action,
        cost,
        // Trasanction
        acquisition,
        turnOver,
        returned,
        // Officer details
        office,
        rank,
        lastName,
        firstName,
        middleName,
        QLFR,
        email,
        phoneNumber,
        address,
        age,
        civilStatus,
        gender,
        status,
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
    //Guns details
    Gtype,
    Gname,
    manufacturer,
    caliber,
    serialN,
    barrel_Length,
    weight,
    roundCapacity,
    action,
    cost,

    // Trasanction
    acquisition,
    turnOver,
    returned,
    // Officer details

    office,
    rank,
    lastName,
    firstName,
    middleName,
    QLFR,
    email,
    phoneNumber,
    address,
    age,
    civilStatus,
    gender,
    status,
  } = req.body;

  try {
    await client.connect();
    const db = client.db("PNP_management");
    const collection = db.collection("Record");
    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed, so add 1
    const currentYear = new Date().getFullYear();
    const currentDay = new Date().getDate();

    const formattedDay = String(currentDay).padStart(2, "0");

    const updatedAt = `${currentYear}-${currentMonth}-${formattedDay}`;
    const updatedData = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          //Guns details
          Gtype: Gtype,
          Gname: Gname,
          manufacturer: manufacturer,
          caliber: caliber,
          serialN: serialN,
          barrel_Length: barrel_Length,
          weight: weight,
          roundCapacity: roundCapacity,
          action: action,
          cost: parseInt(cost),
          // Trasanction
          acquisition: acquisition,
          turnOver: turnOver,
          returned: returned,
          // Officer details
          office: office,
          rank: rank,
          lastName: lastName,
          firstName: firstName,
          middleName: middleName,
          QLFR: QLFR,
          email: email,
          phoneNumber: phoneNumber,
          address: address,
          age: age,
          civilStatus: civilStatus,
          gender: gender,
          status: status,
          //basic info
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
