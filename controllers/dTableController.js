const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getDTable = async function(req, res) {
    const data = await prisma.data.findMany();
    const datas = data.map((row) => {
      const {id,Gtype, Gname, caliber, serialN, acquisition, checkIn, checkOut, cost, station, rank, lastName, firstName, middleName, QLFR, qrCode } = row;
      
      return {
        id,
        Gtype,
        Gname,
        caliber,
        serialN,
        acquisition,
        checkIn,
        checkOut,
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
    res.render('dTable', { datas: datas, user: req.user  });
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

      res.redirect("/home"); // Redirect to the home page or any desired location
    }
 
};
