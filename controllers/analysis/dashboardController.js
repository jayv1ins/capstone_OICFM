const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getDashboard = async function(req, res) {
  
    res.render('analysis/dashboard');

};
exports.filterData = async function(req, res) {
  const { startDate, endDate } = req.query;
  let sort = req.query.sort;

  const yearOption = newData.map((row) => {
    const {  acquisition,  } = row;

    return {
      acquisition,
    };
  });

};