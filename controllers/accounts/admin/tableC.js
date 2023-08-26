const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getDTable = async function(req, res) {
  try {
    // the request query options
    const searchQuery = req.query.search || '';

    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const queryOptions = {
      where: {},
      orderBy: { id: 'desc' },
      skip: offset,
      take: limit,
    };

     // The search filtering query 
     if (searchQuery) {
      queryOptions.where.OR = [
        { firstName: { contains: searchQuery, mode: 'insensitive' } },
        { lastName: { contains: searchQuery, mode: 'insensitive' } },
        { middleName: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    // Retrieve data and suggestions from the database with/without queryOptions
    const [newData, suggestionsData] = await Promise.all([
      prisma.userTest.findMany(queryOptions),
      prisma.userTest.findMany({
        where: queryOptions.where,
        select: {
          firstName: true,
          lastName: true,
          middleName: true,
        },
        distinct: ['firstName', 'lastName', 'middleName'], // Ensure unique suggestions
      }),
    ]);

    // Extract the suggestion strings from the query result
    const suggestionStrings = suggestionsData.flatMap((suggestion) => [
      `${suggestion.lastName}, ${suggestion.firstName} ${suggestion.middleName}`,
    ]);
    const suggestions = [...new Set(suggestionStrings)];
    

    // Implement the pagination
    const totalRecords = await prisma.userTest.count();
    const totalPages = Math.ceil(totalRecords / limit);

    const datas = newData.map((row) => {
      const { id, rank, lastName, firstName, middleName, QLFR, policeId, station } = row;

      return {
        id,
        station,
        rank,
        lastName,
        firstName,
        middleName,
        QLFR,
        policeId
      };
    });
    res.render('accounts/admin/table', { datas, totalPages, page, limit, totalRecords, user: req.user, searchQuery, suggestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while retrieving the data." });
  }
};

  


exports.deleteManager = async function(req, res) {
  const id = String(req.params.id);

    // Retrieve the existing data
    const existingData = await prisma.userTest.findUnique({
      where: { id: id },
    });

    if (existingData == null) {
      res.status(404).send("Data not found");
    } else {
      // Delete the data
      await prisma.userTest.delete({
        where: { id: id },
      });

      res.redirect("/admin/table");
    }
 
};


