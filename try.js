const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fetchData() {
  try {
    const existingData = await prisma.data.findFirst({
      where: { serialN: 'PNP05012' },
      //"7843a696-43f8-4747-adf8-5aa57481603f"
    });

    if (existingData) {
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
          
        },
      });

      console.log(updatedData);
      console.log('the date today', formattedDate, 'the date tomorrow', formattedDateNextDay);
    } else {
      console.log('No data found for serialN: 1234');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fetchData();




