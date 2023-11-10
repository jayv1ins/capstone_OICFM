const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createDataEntries() {
  try {
    // Create an array of data to be inserted
    const dataEntries = [
      {
        Gtype: "Pistol",
        Gname: "Canik Striker TP9 SF",
        caliber: "9MM",
        serialN: "T6472-18-BG 10191",
        acquisition: "2019/12/02",
        TurnOver: "2023/7/25",
        Returned: "2023/7/30",
        cost: 23995,
        station: "Sub-Station 8",
        rank: "Pat",
        lastName: "Azucena",
        firstName: "Jaypee",
        middleName: "Molina",
        QLFR: "",
        createdAt: now(),
        updatedAt: now(),
        archived: false,
      },
      // Add more entries below
      {
        Gtype: "Pistol",
        Gname: "Canik Striker TP9 SF",
        caliber: "9MM",
        serialN: "T6472-18-BG 11935",
        acquisition: "2019/12/02",
        TurnOver: "2023/7/25",
        Returned: "2023/7/30",
        cost: 23995,
        station: "Sub-Station 4",
        rank: "PCpl",
        lastName: "Gabano",
        firstName: "Robert",
        middleName: "Buenavistra Jr",
        QLFR: "",
        createdAt: now(),
        updatedAt: now(),
        archived: false,
      },
      {
        Gtype: "Pistol",
        Gname: "Canik Striker TP9 SF",
        caliber: "9MM",
        serialN: "T6472-18-BG 15763",
        acquisition: "2019/12/02",
        TurnOver: "2023/7/25",
        Returned: "2023/7/30",
        cost: 23995,
        station: "OCOP-OACOPA",
        rank: "PCpl",
        lastName: "Gamayao",
        firstName: "Jelyn",
        middleName: "Hipos",
        QLFR: "",
        createdAt: now(),
        updatedAt: now(),
        archived: false,
      },
    ];

    // Insert data entries into the database
    const createdEntries = await prisma.Gun_Detail.createMany({
      data: dataEntries,
    });
    console.log(createdEntries.count);
    console.log(`${createdEntries.count} entries created.`);
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
}

createDataEntries();
