const { MongoClient, ObjectId } = require("mongodb");
const DATABASE_URL =
  "mongodb+srv://majnnakpil:nakpilers@nakpilcluster.ervgh0t.mongodb.net/PNP_management";
const client = new MongoClient(DATABASE_URL);
const { log } = require("debug/src/browser");

//For Vision API
const { ImageAnnotatorClient } = require("@google-cloud/vision");
const credentials = require("../../aye.json");
const e = require("express");

// new Client for Vision
const visionC = new ImageAnnotatorClient({
  credentials: {
    private_key: credentials.private_key,
    client_email: credentials.client_email,
  },
});

exports.scanner = (req, res) => {
  res.render("guns/scanner", {
    user: req.user,
    text: "",
    successMessage: "",
    errorMessage: "",
    GnameD: "",
    GtypeD: "",
    lastNameD: "",
    turnOverD: "",
    returnedD: "",
  });
};

exports.scanUpdate = async (req, res) => {
  try {
    const [result] = await visionC.textDetection(req.file.buffer);
    console.log("anoto", result.fullTextAnnotation.text);
    const text = result.fullTextAnnotation.text;
    console.log("this is text ", text);
    await client.connect();
    const db = client.db("PNP_management");
    const collection = db.collection("Record");

    const serialNumber = result.fullTextAnnotation.text;

    const existingData = await collection.findOne({
      serialN: serialNumber,
    });

    if (existingData) {
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

      const successMessage =
        "The Serial Number of " + serialNumber + " is valid";
      const IdD = existingData._id;
      const GnameD = existingData.Gname;
      const GtypeD = existingData.Gtype;
      const lastNameD = existingData.lastName;
      const turnOverD = existingData.turnOver;
      const returnedD = existingData.returned;

      return res.status(200).json({
        user: req.user,
        text,
        successMessage,
        errorMessage: "",
        GnameD,
        GtypeD,
        lastNameD,
        turnOverD,
        returnedD,
      });
      console.log("succ is ", successMessage);
    } else {
      const errorMessage =
        "Please Try again with clearer Image or check the Serial Number of the Gun";
      return res.status(200).json({
        user: req.user,
        text,
        errorMessage,
        successMessage: "",
      });
      console.log("err is ", errorMessage);
    }
  } catch (err) {
    await client.close();
    console.error(err);
    res.status(500).send("Error processing the image." + err.message);
  }
};
