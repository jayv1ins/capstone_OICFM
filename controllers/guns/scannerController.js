const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.scanner = (req, res) => {
  res.render('guns/scanner', { user: req.user });
};
exports.scanUpdate = async (req, res) => {
  console.log('Received data from client:', req.body);
  const { qrCodeMessage, turnOver } = req.body;

  // Split the qrCodeMessage to extract lastName and firstName
  const splitMessage = qrCodeMessage.split(' ');
  const id = splitMessage[0];

  try {
    // Update the data in the database based on lastName and firstName
    const updatedData =  await prisma.data.update({
      where: { id },
      data: {
        turnOver,
      },
    });

    console.log('Data updated successfully:', updatedData);

    // You can also send a response to the client if needed
    return res.json({ message: 'Data updated successfully', data: updatedData });
  } catch (error) {
    console.error('Error updating data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
