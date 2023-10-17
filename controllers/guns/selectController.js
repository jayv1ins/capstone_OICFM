const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getSelect = async function (req, res) {
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
      res.status(404).send("Data not found");
    } else {
      const { Gtype, Gname, caliber, serialN, acquisition, turnOver, returned, cost, station, rank, lastName, firstName, middleName, QLFR, qrCode} = data;

      res.render("guns/select", { user:req.user, 
        data: { id, Gtype, Gname, caliber, serialN, acquisition, turnOver, returned, cost, station, rank, lastName, firstName, middleName, QLFR} 
       });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }

  
};


