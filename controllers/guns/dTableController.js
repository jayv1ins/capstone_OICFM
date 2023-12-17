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
    const lastDay = new Date(currentYear, currentMonth, 0).getDate();

    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    // Dynamically construct the date range
    const start = new Date(`${currentYear}-${currentMonth}-01`);
    const end = new Date(`${currentYear}-${currentMonth}-${lastDay}`);

    const startString = `${currentYear}-${currentMonth}-01`;
    const endString = `${currentYear}-${currentMonth}-${lastDay}`;

    const New = await collection.countDocuments({
      archived: false,
      createdAt: {
        $gte: startString,
        $lte: endString,
      },
    });

    const Scanned = await collection.countDocuments({
      archived: false,
      turnOver: {
        $gte: startString,
        $lte: endString,
      },
    });

    const NotScanned = await collection.countDocuments({
      archived: false,
      turnOver: {
        $gte: `${currentYear}-01-01`,
        $lte: `${currentYear}-${lastMonth}-${lastDay}`,
      },
    });

    const Remove = await collection.countDocuments({
      archived: true,
      updatedAt: {
        $gte: startString,
        $lte: endString,
      },
    });

    //----------------------------------------------------------------------------------------------

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    //----------------------------------------------------------------------------------------------

    // Build the MongoDB query with optional date and search filtering
    const queryOptions = {};

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
        { office: searchRegex },
        { serialN: searchRegex },
        { caliber: searchRegex },
        { status: searchRegex },
        { city: searchRegex },
      ];
    }
    //----------------------------------------------------------------------------------------------

    // Date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        $and: [
          { turnOver: { $gte: startDate } },
          { turnOver: { $lte: endDate } },
        ],
      };
    }
    //----------------------------------------------------------------------------------------------

    // Base query checkbox
    let CBgunTypes = req.query.Gtype || [];
    let CBgunNames = req.query.Gname || [];
    let CBranks = req.query.rank || [];
    let CBoffices = req.query.office || [];
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

    const distinctStation = await collection.distinct("office", {
      archived: false,
      office: { $exists: true, $ne: null },
    });
    const distinctCaliber = await collection.distinct("caliber", {
      archived: false,
      caliber: { $exists: true, $ne: null },
    });

    const checkbGunTypes = distinctGunTypes;
    const checkbGunNames = distinctGunNames;
    const checkbRanks = distinctRank;
    const checkbOffices = distinctStation;
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
    if (!Array.isArray(CBoffices)) {
      CBoffices = [CBoffices];
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

    if (CBoffices.length > 0) {
      searchFilter.office = { $in: CBoffices };
    }

    if (CBcalibers.length > 0) {
      searchFilter.caliber = { $in: CBcalibers };
    }
    //----------------------------------------------------------------------------------------------

    // Base Data from database
    const projection = {
      id: true,
      //Guns details
      Gtype: true,
      Gname: true,
      caliber: true,
      serialN: true,
      barrel_Length: true,
      weight: true,
      roundCapacity: true,
      action: true,
      cost: true,
      // Trasanction
      acquisition: true,
      turnOver: true,
      returned: true,
      // Officer details
      office: true,
      rank: true,
      lastName: true,
      firstName: true,
      middleName: true,
      QLFR: true,
      email: true,
      phoneNumber: true,
      street: true,
      barangay: true,
      city: true,
      age: true,
      civilStatus: true,
      gender: true,
      status: true,
    };

    // Final filter to display
    const filter = {
      $and: [searchFilter, dateFilter],
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
        //Guns details
        Gtype,
        Gname,
        manufacturer,
        caliber,
        serialN,
        barrel_Length,
        weight,
        roundCapacity,
        action,
        cost,

        // Trasanction
        acquisition,
        turnOver,
        returned,
        // Officer details

        office,
        rank,
        lastName,
        firstName,
        middleName,
        QLFR,
        email,
        phoneNumber,
        street,
        barangay,
        city,
        age,
        civilStatus,
        gender,
        status,
      } = row;

      return {
        id,
        //Guns details
        Gtype,
        Gname,
        manufacturer,
        caliber,
        serialN,
        barrel_Length,
        weight,
        roundCapacity,
        action,
        cost,

        // Trasanction
        acquisition,
        turnOver,
        returned,
        // Officer details

        office,
        rank,
        lastName,
        firstName,
        middleName,
        QLFR,
        email,
        phoneNumber,
        address,
        age,
        civilStatus,
        gender,
        status,
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
      CBoffices,
      checkbOffices,
      checkbCalibers,
      CBcalibers,
      //Card Count
      TotalGun,
      New,
      Scanned,
      NotScanned,
      Remove,
      errorMessage: null,
      successMessage: null,
    });
    // For debugging purposes
    console.log("end", endString);
    console.log("start", startString);
    // console.log("what is this", filter);
    // console.log("date", dateFilter);
    // console.log("startDate:", startDate);
    // console.log("endDate:", endDate);
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

    const currentMonth = new Date().getMonth() + 1; // Months are zero-indexed, so add 1
    const currentYear = new Date().getFullYear();
    const currentDay = new Date().getDate();
    const formattedDay = String(currentDay).padStart(2, "0");

    const updatedAt = `${currentYear}-${currentMonth}-${formattedDay}`;

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
        { $set: { archived: true, updatedAt } }
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
      office: true,
      rank: true,
      lastName: true,
      firstName: true,
      middleName: true,
      QLFR: true,
    };

    const data = await collection
      .find({ archived: false })
      .sort({ lastName: 1 })
      .project(projection)
      .toArray();

    // Create a new Excel workbook
    const wb = XLSX.utils.book_new();

    const currentYear = new Date().getFullYear();
    const monthNames = [
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Create a sheet for all months
    const allMonthsHeaders = [
      "Type",
      "Make",
      "Cal",
      "Serial Nr",
      "Acquisition Date",
      "Acquisition Cost",
      "TurnOver",
      "Returned",
      "Office",
      "Rank",
      "Last Name",
      "First Name",
      "Middle Name",
      "QLF",
    ];

    const allMonthsData = data.map((record) => ({
      Type: record.Gtype,
      Make: record.Gname,
      Cal: record.caliber,
      "Serial Nr": record.serialN,
      "Acquisition Date": record.acquisition,
      TurnOver: record.turnOver,
      Returned: record.returned,
      "Acquisition Cost": record.cost,
      Office: record.office,
      Rank: record.rank,
      "Last Name": record.lastName,
      "First Name": record.firstName,
      "Middle Name": record.middleName,
      QLF: record.QLFR,
    }));

    const allMonthsWs = XLSX.utils.json_to_sheet(allMonthsData, {
      header: allMonthsHeaders,
    });

    allMonthsWs["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
      { s: { r: 0, c: 4 }, e: { r: 0, c: 7 } },
      { s: { r: 0, c: 8 }, e: { r: 0, c: 13 } },
    ];

    XLSX.utils.book_append_sheet(wb, allMonthsWs, "AllMonths");

    // Create sheets for individual months
    for (let i = 6; i <= 11; i++) {
      const filteredData = data.filter((record) => {
        const turnOverDate = new Date(record.turnOver);
        return (
          turnOverDate.getMonth() === i &&
          turnOverDate.getFullYear() === currentYear
        );
      });

      const monthHeaders = [...allMonthsHeaders]; // Copy headers
      const monthData = filteredData.map((record) => ({
        Type: record.Gtype,
        Make: record.Gname,
        Cal: record.caliber,
        "Serial Nr": record.serialN,
        "Acquisition Date": record.acquisition,
        TurnOver: record.turnOver,
        Returned: record.returned,
        "Acquisition Cost": record.cost,
        Office: record.office,
        Rank: record.rank,
        "Last Name": record.lastName,
        "First Name": record.firstName,
        "Middle Name": record.middleName,
        QLF: record.QLFR,
      }));

      const monthWs = XLSX.utils.json_to_sheet(monthData, {
        header: monthHeaders,
      });

      monthWs["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
        { s: { r: 0, c: 4 }, e: { r: 0, c: 7 } },
        { s: { r: 0, c: 8 }, e: { r: 0, c: 13 } },
      ];

      XLSX.utils.book_append_sheet(wb, monthWs, monthNames[i - 6]);
    }

    // Create a sheet for current month's statistics
    const currentMonth = new Date().getMonth() + 1;
    const lastDay = new Date(currentYear, currentMonth, 0).getDate();
    const startString = `${currentYear}-${currentMonth}-01`;
    const endString = `${currentYear}-${currentMonth}-${lastDay}`;

    const New = await collection.countDocuments({
      archived: false,
      createdAt: {
        $gte: startString,
        $lte: endString,
      },
    });

    const Scanned = await collection.countDocuments({
      archived: false,
      turnOver: {
        $gte: startString,
        $lte: endString,
      },
    });

    const NotScanned = await collection.countDocuments({
      archived: false,
      turnOver: {
        $gte: `${currentYear}-01-01`,
        $lte: `${currentYear}-${currentMonth - 1}-${lastDay}`,
      },
    });

    const Remove = await collection.countDocuments({
      archived: true,
      updatedAt: {
        $gte: startString,
        $lte: endString,
      },
    });

    const currentMonthStatsHeaders = ["Category", "Count"];

    const currentMonthStatsData = [
      { Category: "New", Count: New },
      { Category: "Scanned", Count: Scanned },
      { Category: "Not Scanned", Count: NotScanned },
      { Category: "Losses", Count: Remove },
    ];

    const currentMonthStatsWs = XLSX.utils.json_to_sheet(
      currentMonthStatsData,
      {
        header: currentMonthStatsHeaders,
      }
    );

    XLSX.utils.book_append_sheet(
      wb,
      currentMonthStatsWs,
      "CurrentMonthStatistics"
    );

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
          //Guns details
          Gtype: true,
          Gname: true,
          caliber: true,
          serialN: true,
          barrel_Length: true,
          weight: true,
          roundCapacity: true,
          action: true,
          cost: true,
          // Trasanction
          acquisition: true,
          turnOver: true,
          returned: true,
          // Officer details
          office: true,
          rank: true,
          lastName: true,
          firstName: true,
          middleName: true,
          QLFR: true,
          email: true,
          phoneNumber: true,
          address: true,
          age: true,
          civilStatus: true,
          gender: true,
          status: true,
        },
      }
    );

    if (!data) {
      return res.status(404).send("Data not found");
    }

    const {
      //Guns details
      Gtype,
      Gname,
      manufacturer,
      caliber,
      serialN,
      barrel_Length,
      weight,
      roundCapacity,
      action,
      cost,

      // Trasanction
      acquisition,
      turnOver,
      returned,
      // Officer details

      office,
      rank,
      lastName,
      firstName,
      middleName,
      QLFR,
      email,
      phoneNumber,
      address,
      age,
      civilStatus,
      gender,
      status,
    } = data;

    // console.log("Data is:", data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
    await client.close();
  }
};
