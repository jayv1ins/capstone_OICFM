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
    const existingGunDetail = await collection.findOne({
      serialN,
      archived: false,
    });
    if (existingGunDetail) {
      const message =
        existingGunDetail.serialN === serialN
          ? "Serial Number already taken"
          : null;
      res.render("/DataTable", { message, user: req.user });
    }

    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed, so add 1
    const currentYear = new Date().getFullYear();
    const currentDay = new Date().getDate();

    const createdAt = `${currentYear}-${currentMonth}-${currentDay}`;
    const updatedAt = `${currentYear}-${currentMonth}-${currentDay}`;
    const NewRegister = await collection.insertOne({
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
      createdAt: createdAt,
      updatedAt: updatedAt,
      archived: false,
    });
    const SuccessMessage = "Successfully Registered!";
    res.redirect(`/DataTable`);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the data." });
    await client.close();
  }
};
