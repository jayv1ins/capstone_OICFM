const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCreate = (req, res) => {
  res.render('guns/create', { user: req.user });
};


exports.postCreate = async (req, res) => {

  const { Gtype, Gname, caliber, serialN, acquisition, turnOver, returned, cost, station, rank, lastName, firstName, middleName, QLFR } = req.body;

  // Validation code
  if (
    lastName.length < 3 ||
    firstName.length < 3 ||
    middleName.length < 3 
  ) {
    return res.render('guns/create', { ErrorMessage: 'Names should be more than 3 characters long' });
  }

  if (
    !lastName.match(/^[A-Za-z\u4E00-\u9FFF]+$/) ||
    !firstName.match(/^[A-Za-z\u4E00-\u9FFF]+$/) ||
    !middleName.match(/^[A-Za-z\u4E00-\u9FFF]+$/)
  ) { 
    return res.render('guns/create', { ErrorMessage: 'Only alphabetic or logographic characters' });
  }

  try {
    const newResult = await prisma.record.create({
      data: {
        Gtype,
        Gname,
        caliber,
        serialN,
        acquisition,
        turnOver,
        returned,
        cost: parseInt(cost),
        station,
        rank,
        lastName,
        firstName,
        middleName,
        QLFR,
      },
    });

  

    return res.redirect(`/select/${newResult.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while creating the data." });
  }
};


