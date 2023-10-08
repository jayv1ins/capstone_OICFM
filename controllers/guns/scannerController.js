const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.scanner = (req, res) => {
  res.render('guns/scanner', { user: req.user });
};

exports.scanUpdate = async (req, res) => {
  console.log('Received data from client:', req.body);
  let { serialNumber } = req.body; 
  
  // Remove newline character (\n) from the serial number
  serialNumber = serialNumber.replace(/\n/g, '');

  console.log('serialNumber:', serialNumber);

  try {
    const existingData = await prisma.data.findFirst({
      where: { serialN: serialNumber },
    });

    if (existingData) {
      console.log('the existing data is :', existingData);
      // Get the current date
      const currentDate = new Date();

      // Extract year, month, and day from the current date
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Month is zero-indexed
      const day = currentDate.getDate();

      // Create a date string in 'YYYY-MM-DD' format
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      // For the next day
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1);
      const addDay = nextDay.getDate();
      const formattedDateNextDay = `${year}-${month.toString().padStart(2, '0')}-${addDay.toString().padStart(2, '0')}`;
      
      // Update the data in the database using Prisma's automatic handling of _id
      const updatedData = await prisma.data.update({
        where: { id: existingData.id },
        data: {
          turnOver: formattedDate,
          returned: formattedDateNextDay,
        },
      });

      console.log(updatedData);
      console.log('the date today', formattedDate, 'the date tomorrow', formattedDateNextDay);
    } else {
      console.log('No data found for serialN:', serialNumber);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    await prisma.$disconnect();
  }
};




