const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const DataModel = prisma.data;

exports.getIndex = function(req, res) {
    res.render('index');
    //res.render('dashboard', { user: req.user});
}