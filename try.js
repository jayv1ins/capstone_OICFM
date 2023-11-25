const { MongoClient } = require("mongodb");

const DATABASE_URL =
  "mongodb+srv://majnnakpil:nakpilers@nakpilcluster.ervgh0t.mongodb.net/PNP_management";

async function fetchData() {
  const client = new MongoClient(DATABASE_URL, { useUnifiedTopology: true });

  try {
    await client.connect();

    const db = client.db("PNP_management");
    const collection = db.collection("Record");

    // Get current month and year
    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed, so add 1
    const currentYear = new Date().getFullYear();
    const currentDate = new Date();

    // Dynamically construct the date range
    const start = `${currentYear}-${currentMonth}-01`;
    const end = `${currentYear}-${currentMonth}-30`;

    // Find and log details of new documents
    const newDocuments = await collection
      .find({
        archived: false,
        turnOver: {
          $gte: start,
          $lte: end,
        },
      })
      .toArray();

    console.log("New Documents:");
    newDocuments.forEach((document) => {
      console.log("Details:", document);
    });

    // Count and log the total number of new and archived documents
    const totalNew = await collection.countDocuments({
      archived: false,
      turnOver: {
        $gte: start,
        $lte: end,
      },
    });

    const totalArchived = await collection.countDocuments({
      archived: true,
      turnOver: {
        $gte: start,
        $lte: end,
      },
    });
    console.log("date ", currentDate);
    console.log("Total Documents new:", totalNew);
    console.log("Total Archived:", totalArchived);
  } finally {
    await client.close();
  }
}

fetchData();
