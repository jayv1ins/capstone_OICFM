async function generateDummyEntries() {
  const { MongoClient } = require("mongodb");
  const faker = require("faker");
  const DATABASE_URL =
    "mongodb+srv://majnnakpil:nakpilers@nakpilcluster.ervgh0t.mongodb.net/PNP_management";
  const client = new MongoClient(DATABASE_URL);
  const db = client.db("PNP_management");
  const collection = db.collection("Guns");
  try {
    function generateDummyData(numSets) {
      const dummyData = [];

      const baseSets = [
        { Gname: "GLOCK 17 GEN 4", cost: 16659 },
        { Gname: "TAURUS TS9 SF", cost: 18490 },
        { Gname: "PIETRO BERETTA", cost: 10469 },
        { Gname: "BERETTA", cost: 19400 },
        // Add more sets as needed
      ];

      for (let i = 0; i < numSets; i++) {
        // Pick a set randomly from the base sets
        const baseSet = faker.random.arrayElement(baseSets);

        // Generate a random month, favoring December with 70%
        const randomMonth = faker.random.boolean()
          ? "12"
          : faker.random.arrayElement(["07", "08", "09", "10", "11"]);

        // Set the day to 2 for turnover and 3 for returned
        const dayTurnover = "02";
        const dayReturned = "03";

        // Form the date string for turnover and returned
        const dateStringTurnover = `2023-${randomMonth}-${dayTurnover}`;
        const dateStringReturned = `2023-${randomMonth}-${dayReturned}`;

        const entry = {
          Gtype: "PISTOL",
          Gname: baseSet.Gname,
          caliber: "9MM",
          serialN: faker.random.alphaNumeric(8).toUpperCase(),
          acquisition: faker.date.past(10).toISOString().split("T")[0],
          turnOver: dateStringTurnover,
          returned: dateStringReturned,
          cost: baseSet.cost,
          office: faker.company.companyName(),
          rank: faker.name.prefix(),
          lastName: faker.name.lastName(),
          firstName: faker.name.firstName(),
          middleName: faker.name.lastName(),
          QLFR: "",
          createdAt: dateStringTurnover, // Set createdAt to turnover date
          updatedAt: dateStringReturned, // Set updatedAt to returned date
          archived: faker.random.boolean(),
        };

        dummyData.push(entry);
      }

      return dummyData;
    }

    const dummyEntries = generateDummyData(15);
    const createdEntries = await collection.insertMany(dummyEntries);
    console.log(`${createdEntries.insertedCount} entries created.`);
  } catch (error) {
    console.error("Error creating entries:", error);
  } finally {
    await client.close();
  }
}

generateDummyEntries();
