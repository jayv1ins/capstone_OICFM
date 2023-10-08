const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const qrcode = require('qrcode');

exports.getCreate = (req, res) => {
  res.render('guns/create', { user: req.user });
};


exports.postCreate = async (req, res) => {

  const { Gtype, Gname, caliber, serialN, acquisition, turnOver, returned, cost, station, rank, lastName, firstName, middleName, QLFR } = req.body;
  const qrCodeData = await generateQRCode(`${lastName} ${firstName} ${middleName} ${QLFR} ${rank} ${station} ${Gtype} ${Gname} ${caliber} ${serialN} ${cost} ${acquisition} ${turnOver} ${returned} ${cost}`);

  // Validation code
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

    // Now update the qrCodeData with the newly created ID
    const updatedQrCodeData = await generateQRCode(`${result.id} ${lastName} ${firstName} ${middleName} ${QLFR} ${rank} ${station} ${Gtype} ${Gname} ${caliber} ${serialN} ${cost} ${acquisition} ${turnOver} ${returned} ${cost}`);

    // Save the updated QR code data to the database
    await prisma.data.update({
      where: { id: result.id },
      data: { qrCode: updatedQrCodeData },
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

