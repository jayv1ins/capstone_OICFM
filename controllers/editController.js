const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const DataModel = prisma.data;

exports.getEdit = async function (req, res) {
  const id = String(req.params.id);

  try {
    const data = await DataModel.findUnique({
      where: { id },
      select: {
        id: true,
        Gtype: true,
        Gname: true,
        caliber: true,
        serialN: true,
        acquisition: true,
        turnOver: true,
        returned: true,
        cost: true,
        station: true,
        rank: true,
        lastName: true,
        firstName: true,
        middleName: true,
        QLFR: true,
      },
    });



    if (!data) {
      return res.status(404).send("Data not found");
    }

    const { Gtype, Gname, caliber, serialN, acquisition, turnOver, returned, cost, station, rank, lastName, firstName, middleName, QLFR} = data;

    return res.render("edit", { title: "Edit Data", data: { id, Gtype, Gname, caliber, serialN, acquisition, turnOver, returned, cost, station, rank, lastName, firstName, middleName, QLFR} });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.updatedData = async function (req, res) {
  const id = String(req.params.id);
  const {Gtype, Gname, caliber, serialN, acquisition, turnOver, returned, cost, station, rank, lastName, firstName, middleName, QLFR} = req.body;

  try {
    const updatedData = await prisma.data.update({
      where: { id },
      data: {
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
      },
      select: {
        id: true,
        Gtype: true,
        Gname: true,
        caliber: true,
        serialN: true,
        acquisition: true,
        turnOver: true,
        returned: true,
        cost: true,
        station: true,
        rank: true,
        lastName: true,
        firstName: true,
        middleName: true,
        QLFR: true,
      },
    });

    res.redirect(`/edit/${id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
