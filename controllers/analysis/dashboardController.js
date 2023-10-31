const { MongoClient } = require("mongodb");
const DATABASE_URL =
  "mongodb+srv://majnnakpil:nakpilers@nakpilcluster.ervgh0t.mongodb.net/PNP_management";
const client = new MongoClient(DATABASE_URL);

exports.getDashboard = async function (req, res) {
  res.render("analysis/dashboard", { user: req.user });
};
