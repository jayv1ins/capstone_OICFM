const XLSX = require("xlsx");

const { MongoClient, ObjectId } = require("mongodb");
const DATABASE_URL =
  "mongodb+srv://majnnakpil:nakpilers@nakpilcluster.ervgh0t.mongodb.net/PNP_management";
const client = new MongoClient(DATABASE_URL);

exports.getDTable = async function (req, res) {
  try {
    //connection to database
    await client.connect();
    const db = client.db("PNP_management");
    const collection = db.collection("Record");
    // Date query options
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    // The Card Count
    const TotalGun = await collection.countDocuments({
      archived: false,
    });

    // Get current month and year
    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed, so add 1
    const currentYear = new Date().getFullYear();

    // Dynamically construct the date range
    const start = `${currentYear}-${currentMonth}-01`;
    const end = `${currentYear}-${currentMonth}-30`;

    const New = await collection.countDocuments({
      archived: false,
      turnOver: {
        $gte: start,
        $lte: end,
      },
    });

    const Remove = await collection.countDocuments({
      archived: true,
      turnOver: {
        $gte: start,
        $lte: end,
      },
    });

    //----------------------------------------------------------------------------------------------

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    //----------------------------------------------------------------------------------------------

    // Build the MongoDB query with optional date and search filtering
    const queryOptions = {
      archived: false,
    };

    // Request query options and Build the search filter
    const searchQuery = req.query.search || "";
    const searchFilter = { archived: false };

    // Search filter opttions
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      searchFilter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { middleName: searchRegex },
        { Gname: searchRegex },
        { Gtype: searchRegex },
        { rank: searchRegex },
        { station: searchRegex },
        { serialN: searchRegex },
        { caliber: searchRegex },
      ];
    }
    //----------------------------------------------------------------------------------------------

    // Date filter
    if (startDate && endDate) {
      searchFilter.turnOver = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    //----------------------------------------------------------------------------------------------

    // Base query checkbox
    let CBgunTypes = req.query.Gtype || [];
    let CBgunNames = req.query.Gname || [];
    let CBranks = req.query.rank || [];
    let CBstations = req.query.station || [];
    let CBcalibers = req.query.caliber || [];

    // Checkbox distinct options
    const distinctGunTypes = await collection.distinct("Gtype", {
      archived: false,
      Gtype: { $exists: true, $ne: null },
    });

    const distinctGunNames = await collection.distinct("Gname", {
      archived: false,
      Gname: { $exists: true, $ne: null },
    });
    const distinctRank = await collection.distinct("rank", {
      archived: false,
      rank: { $exists: true, $ne: null },
    });

    const distinctStation = await collection.distinct("station", {
      archived: false,
      station: { $exists: true, $ne: null },
    });
    const distinctCaliber = await collection.distinct("caliber", {
      archived: false,
      caliber: { $exists: true, $ne: null },
    });

    const checkbGunTypes = distinctGunTypes;
    const checkbGunNames = distinctGunNames;
    const checkbRanks = distinctRank;
    const checkbStations = distinctStation;
    const checkbCalibers = distinctCaliber;

    // Option Checkbox filter
    if (!Array.isArray(CBgunTypes)) {
      CBgunTypes = [CBgunTypes];
    }
    if (!Array.isArray(CBgunNames)) {
      CBgunNames = [CBgunNames];
    }
    if (!Array.isArray(CBranks)) {
      CBranks = [CBranks];
    }
    if (!Array.isArray(CBstations)) {
      CBstations = [CBstations];
    }
    if (!Array.isArray(CBcalibers)) {
      CBcalibers = [CBcalibers];
    }

    if (CBgunTypes.length > 0) {
      searchFilter.Gtype = { $in: CBgunTypes };
    }

    if (CBgunNames.length > 0) {
      searchFilter.Gname = { $in: CBgunNames };
    }

    if (CBranks.length > 0) {
      searchFilter.rank = { $in: CBranks };
    }

    if (CBstations.length > 0) {
      searchFilter.station = { $in: CBstations };
    }

    if (CBcalibers.length > 0) {
      searchFilter.caliber = { $in: CBcalibers };
    }
    //----------------------------------------------------------------------------------------------

    // Base Data from database
    const projection = {
      id: true,
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
    };

    // Final filter to display
    const filter = {
      $and: [searchFilter],
    };
    // Final data to display
    const newData = await collection
      .find(filter)
      .project(projection)
      .sort({ lastName: 1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    // Retrieve data and suggestions from the database
    const suggestions = [];
    const totalRecords = await collection.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limit);

    //----------------------------------------------------------------------------------------------

    const datas = newData.map((row) => {
      const id = row._id.toString();
      const {
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
      } = row;

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
      };
    });

    res.render("guns/dTable", {
      datas,
      totalPages,
      page,
      limit,
      totalRecords, // Pagination
      user: req.user,
      searchQuery: searchQuery,
      suggestions: [], // Search
      //Checkbox Dropdown Menu
      CBgunTypes,
      checkbGunTypes,
      CBgunNames,
      checkbGunNames,
      CBranks,
      checkbRanks,
      CBstations,
      checkbStations,
      checkbCalibers,
      CBcalibers,
      //Card Count
      TotalGun,
      New,
      Remove,
    });
    // For debugging purposes
    // console.log("what is this", filter);
    // console.log("distinct", distinctGunTypes);
    // console.log("the checkbox", checkbGunTypes);

    // console.log("distinct rank", distinctRank);
    // console.log("the checkbox rank", checkbRanks);
  } catch (error) {
    console.error(error);
    await client.close(); // Close the connection
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the data." });
  }
};

exports.deleteData = async function (req, res) {
  try {
    const { id } = req.params; // Extract the ID from the request parameters
    await client.connect();
    const db = client.db("PNP_management");
    const collection = db.collection("Record");

    const existingData = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (existingData == null) {
      res.status(404).send("Data not found");
    } else {
      // Delete the data
      await collection.updateOne(
        {
          _id: new ObjectId(id),
        },
        { $set: { archived: true } }
      );

      res.redirect("/DataTable");
    }
  } catch (error) {
    await client.close();
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the data." });
  }
};

exports.exportToExcel = async function (req, res) {
  try {
    await client.connect();
    const db = client.db("PNP_management");
    const collection = db.collection("Record");

    // Fetch all data from your Prisma model
    const projection = {
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
    };
    const data = await collection
      .find({ archived: false })
      .sort({ acquisition: -1 })
      .project(projection)
      .toArray();

    // Get the total count of records
    const totalGunCount = await collection.countDocuments();

    // Create a new Excel workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Add the data worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Table Data");

    // Create a new worksheet for additional data (e.g., total count)
    const extraDataWs = XLSX.utils.json_to_sheet(
      [{ "Total Count": totalGunCount }],
      { header: ["Total Count"] }
    );

    // Add the additional data worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, extraDataWs, "Additional Data");

    // Generate the Excel file as a buffer
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    // Send the Excel file as a response for download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=table_data.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(excelBuffer);
  } catch (error) {
    console.error(error);
    await client.close();
    res
      .status(500)
      .json({ error: "An error occurred while exporting data to Excel." });
  }
};

exports.getSelect = async function (req, res) {
  const id = String(req.params.id);

  try {
    await client.connect();
    const db = client.db("PNP_management");
    const collection = db.collection("Record");

    const data = await collection.findOne(
      {
        _id: new ObjectId(id),
      },
      {
        projection: {
          id: true,
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
      }
    );

    if (!data) {
      return res.status(404).send("Data not found");
    }

    const {
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
    } = data;

    // console.log("Data is:", data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
    await client.close();
  }
};
