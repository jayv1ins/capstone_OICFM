const { MongoClient, ObjectId } = require("mongodb");

const DATABASE_URL =
  "mongodb+srv://majnnakpil:nakpilers@nakpilcluster.ervgh0t.mongodb.net/PNP_management";
const client = new MongoClient(DATABASE_URL);

exports.getDTable = async function (req, res) {
  try {
    //connection to database
    await client.connect();
    const db = client.db("PNP_management");
    const collection = db.collection("User");

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    // MongoDB query options
    const queryOptions = {
      skip: offset,
      sort: { id: -1 }, // Use -1 for descending order
      limit,
    };
    // let query checkbox
    let CBranks = req.query.rank || [];
    let CBstations = req.query.station || [];
    // Checkbox distinct options
    const distinctRank = await collection.distinct("rank", { archived: false });
    const distinctStation = await collection.distinct("station", {
      archived: false,
    });

    const checkbRanks = distinctRank;
    const checkbStations = distinctStation;

    // Request query options and Build the search filter
    const searchQuery = req.query.search || "";
    const searchFilter = { archived: false };

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      searchFilter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { middleName: searchRegex },
        { rank: searchRegex },
        { station: searchRegex },
      ];
    }
    if (!Array.isArray(CBranks)) {
      CBranks = [CBranks];
    }

    if (!Array.isArray(CBstations)) {
      CBstations = [CBstations];
    }

    // To filter if checkbox options are provided
    if (CBranks.length > 0) {
      searchFilter.rank = { $in: CBranks };
    }

    if (CBstations.length > 0) {
      searchFilter.station = { $in: CBstations };
    }
    const projection = {
      id: true,
      station: true,
      rank: true,
      lastName: true,
      firstName: true,
      middleName: true,
      QLFR: true,
      policeId: true,
    };

    // Combine filters
    const filter = {
      $and: [searchFilter],
    };
    // Combine the search filter with query options

    // Retrieve data and suggestions from the database
    const newData = await collection
      .find(filter)
      .project(projection)
      .sort({ _id: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    // Extract suggestion strings (empty in this example)
    const suggestions = [];

    // Get the total count of records
    const totalRecords = await collection.countDocuments(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / limit);

    // Map data to the desired format
    const datas = newData.map((row) => {
      const id = row._id.toString();
      const { rank, lastName, firstName, middleName, QLFR, policeId, station } =
        row;

      return {
        id,
        station,
        rank,
        lastName,
        firstName,
        middleName,
        QLFR,
        policeId,
      };
    });

    // Render the view with data
    res.render("accounts/admin/table", {
      datas,
      totalPages,
      page,
      limit,
      totalRecords,
      user: req.user,
      searchQuery: searchQuery,
      suggestions: [],
      CBranks,
      checkbRanks,
      CBstations,
      checkbStations,
    });
  } catch (error) {
    console.error(error);
    await client.close();
    res.status(500).json({
      error: "An error occurred while retrieving the data." + error.message,
    });
  }
};

exports.deleteManager = async function (req, res) {
  try {
    const { id } = req.params;
    await client.connect();
    const db = client.db("PNP_management");
    const collection = db.collection("User");

    const existingData = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (existingData == null) {
      res.status(404).send("Data not found");
    } else {
      // Archived the User
      await collection.updateOne(
        {
          _id: new ObjectId(id),
        },
        { $set: { archived: true } }
      );

      res.redirect("/admin/table");
    }
  } catch (error) {
    await client.close();
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the data." });
  }
};
