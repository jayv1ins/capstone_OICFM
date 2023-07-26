const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getDTable = async function (req, res) {
  try {
    // the request query options
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const searchQuery = req.query.search || '';
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    // Build the Prisma query with optional date and search filtering
    const queryOptions = {
      where: {},
      orderBy: { id: 'desc' },
      skip: offset,
      take: limit,
    };

    // Add date filtering if startDate and endDate are provided
    if (startDate && endDate) {
      queryOptions.where.acquisition = {
        gte: startDate,
        lte: endDate,
      };
    }

    // The search filtering query 
    if (searchQuery) {
      queryOptions.where.OR = [
        { firstName: { contains: searchQuery, mode: 'insensitive' } },
        { lastName: { contains: searchQuery, mode: 'insensitive' } },
        { middleName: { contains: searchQuery, mode: 'insensitive' } },
        { Gname: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    // Retrieve data and suggestions from the database with/without queryOptions
    const [newData, suggestionsData] = await Promise.all([
      prisma.data.findMany(queryOptions),
      prisma.data.findMany({
        where: queryOptions.where,
        select: {
          firstName: true,
          lastName: true,
          middleName: true,
          Gname: true,
        },
        distinct: ['firstName', 'lastName', 'middleName', 'Gname'], // Ensure unique suggestions
      }),
    ]);

    // Extract the suggestion strings from the query result
    const suggestionStrings = suggestionsData.flatMap((suggestion) => [
      `${suggestion.lastName}, ${suggestion.firstName} ${suggestion.middleName}`,
      suggestion.Gname,
    ]);
    const suggestions = [...new Set(suggestionStrings)];
    

    const totalRecords = await prisma.data.count();
    const totalPages = Math.ceil(totalRecords / limit);

    const datas = newData.map((row) => {
      const { id, Gtype, Gname, caliber, serialN, acquisition, turnOver, returned, cost, station, rank, lastName, firstName, middleName, QLFR, qrCode } = row;

      return {
        id,
        Gtype,
        Gname,
        caliber,
        serialN,
        acquisition,
        turnOver,
        returned,
        cost,
        station,
        rank,
        lastName,
        firstName,
        middleName,
        QLFR,
        qrCode,
        hasQRCode: qrCode !== null && qrCode !== "",
      };
    });

    res.render('guns/dTable', { datas, totalPages, page, limit, totalRecords, user: req.user, searchQuery, suggestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while retrieving the data." });
  }
};

exports.deleteData = async function (req, res) {
  const id = String(req.params.id);

  // Retrieve the existing data
  const existingData = await prisma.data.findUnique({
    where: { id: id },
  });

  if (existingData == null) {
    res.status(404).send("Data not found");
  } else {
    // Delete the data
    await prisma.data.delete({
      where: { id: id },
    });

    res.redirect("/DataTable");
  }
};
