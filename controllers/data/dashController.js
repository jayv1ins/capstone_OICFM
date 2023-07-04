const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const DataModel = prisma.data;

exports.getDash = function(req, res) {
    res.render('data/dash');
    //res.render('dashboard', { user: req.user});
}
