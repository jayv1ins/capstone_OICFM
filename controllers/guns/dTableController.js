const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getDTable = async function (req, res) {
  try {
    //pagination
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 10;
    const offset = (page - 1) * itemsPerPage;

    const newData = await prisma.data.findMany({
      orderBy: { id: 'desc' },
      skip: offset,
      take: itemsPerPage,
    });

    const totalRecords = await prisma.data.count();
    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    const datas = newData.map((row) => {
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

    res.render('guns/dTable', { datas, totalPages, page, itemsPerPage, totalRecords, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while retrieving the data." });
  }
};

exports.deleteData = async function (req, res) {
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
