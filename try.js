const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fetchData() {
  try {
    const currentMonth = new Date().getMonth() + 1; // Get the current month
    const currentYear = new Date().getFullYear(); // Get the current year
    const createdThisMonthCount = await prisma.record.aggregate({
      _count: { id: true },
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-${currentMonth}-01`),
          lt: new Date(`${currentYear}-${currentMonth + 1}-01`),
        },
      },
    });

    // Calculate the count of created last month
    let lastMonth = currentMonth - 1;
    let lastMonthYear = currentYear;
    if (lastMonth === 0) {
      lastMonth = 12;
      lastMonthYear = currentYear - 1;
    }

    const createdLastMonthCount = await prisma.record.aggregate({
      _count: { id: true },
      where: {
        createdAt: {
          gte: new Date(`${lastMonthYear}-${lastMonth}-01`),
          lt: new Date(`${currentYear}-${currentMonth}-01`),
        },
      },
    });

    console.log('Current Month Count:', createdThisMonthCount._count.id);
    console.log('Previous Month Count:', createdLastMonthCount._count.id);

    const currentMonthCount = parseInt(createdThisMonthCount._count.id, 10);
    const previousMonthCount = parseInt(createdLastMonthCount._count.id, 10);

    const monthDifference = currentMonthCount - previousMonthCount;

    console.log('Month Difference:', monthDifference);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

fetchData();
