const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const qrcode = require('qrcode');

exports.getCreate = (req, res) => {
  res.render('guns/create');
};


exports.postCreate = async (req, res) => {
  const { Gtype, Gname, caliber, serialN, acquisition, turnOver, returned, cost, station, rank, lastName, firstName, middleName, QLFR} = req.body;
  const qrCodeData = await generateQRCode(`${Gtype} ${Gname} ${caliber} ${serialN} ${acquisition} ${turnOver} ${returned} ${cost} ${station} ${rank} ${lastName} ${firstName} ${middleName} ${QLFR}`);

  //validation
  if (
    lastName.length < 3 ||
    firstName.length < 3 ||
    middleName.length < 3 
  ) {
    return res.render('guns/create', { ErrorMessage: 'Names should be more than 3 characters long' });
  }

  if (
    !lastName.match(/^[A-Za-z\u4E00-\u9FFF]+$/) ||
    !firstName.match(/^[A-Za-z\u4E00-\u9FFF]+$/) ||
    !middleName.match(/^[A-Za-z\u4E00-\u9FFF]+$/)
  ) {
    return res.render('guns/create', { ErrorMessage: 'Only alphabetic or logographic characters' });
  }

  try {
    const result = await prisma.data.create({
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
        qrCode: qrCodeData,
      },
    });
    return res.redirect(`/select/${result.id}`);

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while creating the data." });
  }
};

async function generateQRCode(newDetails) {
  try {
    const qrCode = await qrcode.toBuffer(newDetails);
    return qrCode;
  } catch (error) {
    throw error;
  }
}