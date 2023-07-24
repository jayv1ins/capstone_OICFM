const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getDTable = async function(req, res) {
  try {
    const newData = await prisma.data.findMany({
      orderBy: { id: 'desc' },
      take: 1,
    });

    const oldData = await prisma.data.findMany({
      orderBy: { id: 'asc' },
      skip: 1,
    });

    const datas = [...newData, ...oldData].map((row) => {
      const { id, Gtype, Gname, caliber, serialN, acquisition, turnOver, returned, cost, station, rank, lastName, firstName, middleName, QLFR, qrCode } = row;

      return {
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
        qrCode,
        hasQRCode: qrCode !== null && qrCode !== "",
      };
    });

    res.render('dTable', { datas, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while retrieving the data." });
  }
};

  


exports.deleteData = async function(req, res) {
  const id = String(req.params.id);

    // Retrieve the existing data
    const existingData = await prisma.data.findUnique({
      where: { id: id },
    });

    if (existingData == null) {
      res.status(404).send("Data not found");
    } else {
      // Delete the data
      await prisma.data.delete({
        where: { id: id },
      });

      res.redirect("/DataTable"); 
    }
 
};
