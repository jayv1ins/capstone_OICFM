const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const qrcode = require('qrcode');

exports.ViewTest = async (req, res) => {
  try {
    const tests = await prisma.test.findMany();
    res.render('view', { tests });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the data.' });
  }
};

exports.getTest = (req, res) => {
  res.render('analysis/test');
};

exports.postTest = async (req, res) => {
  const { Gtype, Gname } = req.body;

  try {
    const qrCodeData = await generateQRCode(`${Gtype} ${Gname}`);

    const result = await prisma.test.create({
      data: {
        Gtype,
        Gname,
        qrCode: qrCodeData,
      },
    });

    return res.render('test', { SuccessMessage: 'Data created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the data.' });
  }
};

async function generateQRCode(userDetails) {
  try {
    const qrCode = await qrcode.toBuffer(userDetails);
    return qrCode;
  } catch (error) {
    throw error;
  }
}
