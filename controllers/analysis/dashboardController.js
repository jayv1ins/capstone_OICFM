const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getDashboard = async function(req, res) {
  
    res.render('analysis/dashboard', { user: req.user});

};
