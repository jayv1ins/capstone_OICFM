const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getCreate = (req, res) => {
  res.render('create');
};


exports.postCreate = async (req, res) => {
  const { Gtype, Gname, caliber, serialN, acquisition, checkIn, checkOut, cost, station, rank, lastName, firstName, middleName, QLFR} = req.body;

  //validation
  if (
    lastName.length < 3 ||
    firstName.length < 3 ||
    middleName.length < 3 
  ) {
    return res.render('register', { ErrorMessage: 'Names should be more than 3 characters long' });
  }

  if (
    !lastName.match(/^[A-Za-z\u4E00-\u9FFF]+$/) ||
    !firstName.match(/^[A-Za-z\u4E00-\u9FFF]+$/) ||
    !middleName.match(/^[A-Za-z\u4E00-\u9FFF]+$/)
  ) {
    return res.render('register', { ErrorMessage: 'Only alphabetic or logographic characters' });
  }

  try {
    const result = await prisma.data.create({
      data: {
        Gtype,
        Gname,
        caliber,
        serialN,
        acquisition,
        checkIn,
        checkOut,
        cost: parseInt(cost),
        station,
        rank,
        lastName,
        firstName,
        middleName,
        QLFR,
      },
    });

    return res.render('create', { SuccessMessage: 'Data created succesfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while creating the data." });
  }
};
