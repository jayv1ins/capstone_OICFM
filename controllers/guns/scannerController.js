const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.scanner = (req, res) => {
  res.render('guns/scanner', { user: req.user });
};

exports.scanUpdate = async (req, res) => {
  console.log('Received data from the client:', req.body);
  let { serialNumber } = req.body;

  // Remove newline character (\n) from the serial number
  serialNumber = serialNumber.replace(/\n/g, '');

  console.log('Serial Number:', serialNumber);

  try {
    const existingData = await prisma.record.findFirst({
      where: { serialN: serialNumber },
    });

    if (existingData) {
      console.log('The existing data is:', existingData);

      // Get the current date
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      // For the next day
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1);
      const addDay = nextDay.getDate();
      const formattedDateNextDay = `${year}-${month.toString().padStart(2, '0')}-${addDay.toString().padStart(2, '0')}`;

      // Update the data in the database using Prisma's automatic handling of _id
      const updatedData = await prisma.record.update({
        where: { id: existingData.id },
        data: {
          turnOver: formattedDate,
          returned: formattedDateNextDay,
        },
      });

      return res.status(200).json({
        updatedData, successMessage: 'Data updated successfully.',
      });

    } else {
      console.log('No data found for serialN:', serialNumber);
      return res.status(200).json({
        updatedData, errorMessage: 'Data not updated successfully.',
      });

    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'An error occurred while updating the data.' });
  } finally {
    await prisma.$disconnect();
  }
};





