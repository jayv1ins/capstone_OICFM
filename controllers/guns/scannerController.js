const { MongoClient, ObjectId } = require("mongodb");
const DATABASE_URL =
  "mongodb+srv://majnnakpil:nakpilers@nakpilcluster.ervgh0t.mongodb.net/PNP_management";
const client = new MongoClient(DATABASE_URL);

exports.scanner = (req, res) => {
  res.render("guns/scanner", { user: req.user });
};

exports.scanUpdate = async (req, res) => {
  let { serialNumber } = req.body;
  console.log("Serial Number:", serialNumber);

  try {
    await client.connect();
    const db = client.db("PNP_management");
    const collection = db.collection("Record");

    const existingData = await collection.findOne({
      serialN: serialNumber,
    });
    console.log("Existing id:", existingData._id);

    const id = existingData._id;
    // Get the current date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    // For the next day
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    const addDay = nextDay.getDate();
    const formattedDateNextDay = `${year}-${month
      .toString()
      .padStart(2, "0")}-${addDay.toString().padStart(2, "0")}`;

    // Update the data in the database using Prisma's automatic handling of _id
    const updatedAt = new Date();
    const updatedData = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          turnOver: formattedDate,
          returned: formattedDateNextDay,
          updatedAt: updatedAt,
        },
      }
    );

    console.log("Updated data:", updatedData);

    return res.status(200).json({
      updatedData,
      successMessage: "Data updated successfully.",
    });
  } catch (error) {
    await client.close();

    console.error("Error fetching data:" + error.message);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the data." });
  }
};
