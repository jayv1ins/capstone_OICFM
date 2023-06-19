const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const DataModel = prisma.data;

exports.getEdit = async function (req, res) {
  const id = String(req.params.id);

  try {
    const data = await DataModel.findUnique({
      where: { id },
      select: {
        id: true,
        lastName: true,
        firstName: true,
        middleName: true,
        gender: true,
        birthdate: true,
        address: true,
        zip: true,
        rank: true,
      },
    });



    if (!data) {
      return res.status(404).send("Data not found");
    }

    const { lastName, firstName, middleName, gender, birthdate, address, zip, rank } = data;

    return res.render("edit", { title: "Edit Data", data: { id, lastName, firstName, middleName, gender, birthdate, address, zip, rank } });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.updatedData = async function (req, res) {
  const id = String(req.params.id);
  const { lastName, firstName, middleName, gender, birthdate, address, zip } = req.body;

  try {
    const updatedData = await prisma.data.update({
      where: { id },
      data: {
        lastName,
        firstName,
        middleName,
        gender,
        birthdate,
        address,
        zip,
      },
      select: {
        id: true,
        lastName: true,
        firstName: true,
        middleName: true,
        gender: true,
        birthdate: true,
        address: true,
        zip: true,
        rank: true,
      },
    });

    res.redirect(`/edit/${id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
