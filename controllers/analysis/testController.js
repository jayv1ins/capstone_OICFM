const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.getTest = (req, res) => {
  res.render('analysis/test');
};

