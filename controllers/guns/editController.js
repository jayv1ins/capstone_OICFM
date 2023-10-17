const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getEdit = async function (req, res) {
  const id = String(req.params.id);

  try {
    const data = await prisma.record.findUnique({
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

    return res.render("guns/edit", { user: req.user,
      data: { id, Gtype, Gname, caliber, serialN, acquisition, turnOver, returned, cost, station, rank, lastName, firstName, middleName, QLFR} 
    });
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
        cost: parseInt(cost),
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

    res.render("guns/edit", { user: req.user, datas,
      SuccessMessage: "Data updated successfully" 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
