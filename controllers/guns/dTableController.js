  const { PrismaClient } = require('@prisma/client');
  const XLSX = require('xlsx');
  const prisma = new PrismaClient();

  exports.getDTable = async function (req, res) {
    try {
      // the request query options
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;
      const searchQuery = req.query.search || '';
      const gunTypes = req.query.Gtype || [];
      const gunNames = req.query.Gname || [];
      const CBranks = req.query.rank || [];
      const CBstations = req.query.station || [];

       // Calculate the count of last names
    const TotalGun = await prisma.data.aggregate({
      _count: { id: true },
    });


    // Calculate the count of last names created this month
    // const currentMonth = new Date().getMonth() + 1; // Get the current month
    // const currentYear = new Date().getFullYear(); // Get the current year
    // const createdThisMonthCount = await prisma.data.aggregate({
    //   _count: { id: true },
    //   where: {
    //     createdAt: {
    //       gte: new Date(`${currentYear}-${currentMonth}-01`),
    //       lt: new Date(`${currentYear}-${currentMonth + 1}-01`),
    //     },
    //   },
    // });

    // Calculate the count of last names deleted this month
    // const deletedThisMonthCount = await prisma.data.aggregate({
    //   _count: { id: true },
    //   where: {
    //     deletedAt: {
    //       gte: new Date(`${currentYear}-${currentMonth}-01`),
    //       lt: new Date(`${currentYear}-${currentMonth + 1}-01`),
    //     },
    //   },
    // });
      //Checkbox
      const distinctGunTypes = await prisma.data.findMany({
        distinct: ['Gtype'],
        select: {
          Gtype: true,
        },
      });

      const distinctGunNames = await prisma.data.findMany({
        distinct: ['Gname'],
        select: {
          Gname: true,
        },
      });

      const distinctRank = await prisma.data.findMany({
        distinct: ['rank'],
        select: {
          rank: true,
        },
      });

      const distinctStation = await prisma.data.findMany({
        distinct: ['station'],
        select: {
          station: true,
        },
      });

      const checkbGunTypes = distinctGunTypes.map((item) => item.Gtype);
      const checkbGunNames = distinctGunNames.map((item) => item.Gname);
      const checkbRanks = distinctRank.map((item) => item.rank);
      const checkbStations = distinctStation.map((item) => item.station);

      
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
          { Gtype: { contains: searchQuery, mode: 'insensitive'} },
          { rank: { contains: searchQuery, mode: 'insensitive' } },
          { station: { contains: searchQuery, mode: 'insensitive'} },
        ];
      }

      // Add Gun Type filtering if gunTypes are provided in checkboxes
      if (gunTypes.length > 0) {
        queryOptions.where.Gtype = {
          in: gunTypes,
        };
      }

      if (gunNames.length > 0) {
        queryOptions.where.Gname = {
          in: gunNames,
        };
      }

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
            Gtype: true,
            rank: true,
            station: true,
          },
          distinct: ['firstName', 'lastName', 'middleName', 'Gname', 'Gtype', 'rank', 'station'], // Ensure unique suggestions
        }),
      ]);

      // Extract the suggestion strings from the query result
      const suggestionStrings = suggestionsData.flatMap((suggestion) => [
       //none to not including any suggestions from the suggestionsData
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
      res.render('guns/dTable', { datas, totalPages, page, limit, totalRecords, user: req.user, searchQuery, suggestions, gunTypes, checkbGunTypes, gunNames,checkbGunNames, CBranks, checkbRanks, CBstations, checkbStations, TotalGun, });
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

  exports.exportToExcel = async function (req, res) {
    try {
      // Fetch all data from your Prisma model
      const data = await prisma.data.findMany({
        select: {
          Gtype: true,
          Gname: true,
          caliber: true,
          serialN: true,
          acquisition: true,
          turnOver: true,
          returned: true,
          cost: true,
          station: true,
          rank: true,
          lastName: true,
          firstName: true,
          middleName: true,
          QLFR: true,
        },
      });

      const TotalGun = await prisma.data.aggregate({
        _count: { id: true },
      });
  
      // Create a new Excel workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(data);
  
      // Add the data worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Table Data');
  
      // Create a new worksheet for additional data (e.g., total count)
      const extraDataWs = XLSX.utils.json_to_sheet([{ 'Total Count': TotalGun._count.id }], { header: ['Total Count'] });
  
      // Add the additional data worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, extraDataWs, 'Additional Data');
  
      // Generate the Excel file as a buffer
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
  
      // Send the Excel file as a response for download
      res.setHeader('Content-Disposition', 'attachment; filename=table_data.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(excelBuffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while exporting data to Excel." });
    }
  };
  
  