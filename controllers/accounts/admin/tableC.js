const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDTable = async function (req, res) {
  try {
    // Request query options
    const searchQuery = req.query.search || '';
    const CBranks = req.query.rank || [];
    const CBstations = req.query.station || [];

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    // Prisma query options
    const queryOptions = {
      where: {},
      orderBy: { id: 'desc' },
      skip: offset,
      take: limit,
    };

    const distinctRank = await prisma.user.findMany({
      distinct: ['rank'],
      select: {
        rank: true,
      },
    });

    const distinctStation = await prisma.user.findMany({
      distinct: ['station'],
      select: {
        station: true,
      },
    });

    const checkbRanks = distinctRank.map((item) => item.rank);
    const checkbStations = distinctStation.map((item) => item.station);


    // Search filtering query
    if (searchQuery) {
      queryOptions.where.OR = [
        { firstName: { contains: searchQuery, mode: 'insensitive' } },
        { lastName: { contains: searchQuery, mode: 'insensitive' } },
        { middleName: { contains: searchQuery, mode: 'insensitive' } },
        { rank: { contains: searchQuery, mode: 'insensitive' } },
        { station: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }
    // To filter if checkbox provided
    if (CBranks.length > 0) {
      queryOptions.where.rank = {
        in: CBranks,
      };
    }

    if (CBstations.length > 0) {
      queryOptions.where.station = {
        in: CBstations,
      };
    }

    // Retrieve data and suggestions from the database
    const [newData, suggestionsData] = await Promise.all([
      prisma.User.findMany(queryOptions),
      prisma.User.findMany({
        where: queryOptions.where,
        select: {
          firstName: true,
          lastName: true,
          middleName: true,
          rank: true,
          station: true,
        },
        distinct: ['firstName', 'lastName', 'middleName', 'rank', 'station'],
      }),
    ]);

    // Extract suggestion strings from the query result
    const suggestionStrings = suggestionsData.flatMap((suggestion) => [
      
    ]);
    const suggestions = [...new Set(suggestionStrings)];

    const totalRecords = await prisma.User.count();
    const totalPages = Math.ceil(totalRecords / limit);

    // Map data to desired format
    const datas = newData.map((row) => {
      const {
        id,
        rank,
        lastName,
        firstName,
        middleName,
        QLFR,
        policeId,
        station,
      } = row;

      return { id, station, rank, lastName, firstName, middleName, QLFR, policeId,};
    });

    // Render the view with data
    res.render('accounts/admin/table', { datas, totalPages, page, limit, totalRecords, user: req.user, searchQuery, suggestions, CBranks, checkbRanks, CBstations, checkbStations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while retrieving the data." });
  }
};


  


exports.deleteManager = async function(req, res) {
  const id = String(req.params.id);

    // Retrieve the existing data
    const existingData = await prisma.User.findUnique({
      where: { id: id },
    });

    if (existingData == null) {
      res.status(404).send("Data not found");
    } else {
      // Delete the data
      await prisma.User.delete({
        where: { id: id },
      });

      res.redirect("/admin/table");
    }
 
};


