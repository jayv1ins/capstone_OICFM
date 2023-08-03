const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.scanner = (req, res) => {
  res.render('guns/scanner');
};

