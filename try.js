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

    // Dynamically construct the date range
    const start = `${currentYear}-${currentMonth}-01`;
    const end = `${currentYear}-${currentMonth}-30`;

    // Aggregate pipeline to filter documents based on 'archived' status and 'turnOver' date
    const pipeline = [
      {
        $match: {
          archived: false,
          turnOver: {
            $gte: start,
            $lte: end,
          },
        },
      },
    ];

    const totalArchivedPipeline = [
      {
        $match: {
          archived: true,
          turnOver: {
            $gte: start,
            $lte: end,
          },
        },
      },
    ];

    // Execute the aggregation pipelines
    const Created = await collection.aggregate(pipeline).toArray();
    const Archived = await collection
      .aggregate(totalArchivedPipeline)
      .toArray();

    console.log("Total Documents:", Created.length);
    console.log("Total Archived:", Archived.length);
  } finally {
    await client.close();
  }
}

fetchData();
