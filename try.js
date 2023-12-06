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

    // Get the last day of the current month
    const lastDay = new Date(currentYear, currentMonth, 0).getDate();

    // Dynamically construct the date range
    const start = `${currentYear}-${currentMonth}-01`;
    const end = `${currentYear}-${currentMonth}-${lastDay}`;

    // Rest of your code remains unchanged

    // Find and log details of new documents
    const newDocuments = await collection
      .find({
        archived: true,
        updatedAt: {
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
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    const totalArchived = await collection.countDocuments({
      archived: true,
      updatedAt: {
        $gte: "0001-01-01",
        $lte: "2023-12-31",
      },
    });

    console.log("Total Documents new:", totalNew);
    console.log("start:", start, end);
    console.log("Total Archived:", totalArchived);
  } finally {
    await client.close();
  }
}

fetchData();
