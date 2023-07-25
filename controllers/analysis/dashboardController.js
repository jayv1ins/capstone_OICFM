const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getDashboard = async function(req, res) {
  
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const targetDate = new Date(lastDayOfMonth);
    const timeLeft = targetDate.getTime() - currentDate.getTime();
    const daysLeft = Math.floor(timeLeft / (1000 * 3600 * 24));
    const hoursLeft = Math.floor((timeLeft % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutesLeft = Math.floor((timeLeft % (1000 * 3600)) / (1000 * 60));
    const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
    


    const countTurnedOver = await prisma.data.count({
      where: {
        turnOver: '2023-6-30',
      },
    });

    const countNotTurnedOver = await prisma.data.count({
      where: {
        turnOver: {
          not: '2023-6-30',
        },
      },
    });

    const firearms = await prisma.data.count();

    res.render('analysis/dashboard', { countTurnedOver, countNotTurnedOver, firearms, daysLeft, hoursLeft, minutesLeft, secondsLeft });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while retrieving the data." });
  }
};