const { PrismaClient } = require('@prisma/client');
const { encrypt } = require('../utils/index');

const prisma = new PrismaClient();

exports.logout = async (req, res) => {
  req.session.user = undefined;

  return res.redirect('login');
};
