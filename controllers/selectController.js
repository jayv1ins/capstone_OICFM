const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getSelect = async function (req, res) {
  const id = String(req.params.id);

  try {
    const data = await prisma.data.findUnique({
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
      res.status(404).send("Data not found");
    } else {
      const { lastName, firstName, middleName, gender, birthdate, address, zip, rank } = data;

      res.render("select", { title: "Edit Data", data: { id, lastName, firstName, middleName, gender, birthdate, address, zip, rank } });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
