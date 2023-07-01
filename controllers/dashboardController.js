const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const DataModel = prisma.data;

exports.getDashboard = function(req, res) {
    res.render('dashboard');
    //res.render('dashboard', { user: req.user});
}