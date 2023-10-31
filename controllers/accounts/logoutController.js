const { MongoClient } = require("mongodb");
const DATABASE_URL =
  "mongodb+srv://majnnakpil:nakpilers@nakpilcluster.ervgh0t.mongodb.net/PNP_management";
const client = new MongoClient(DATABASE_URL);

exports.logout = async (req, res) => {
  req.session.user = undefined;

  return res.redirect("login");
};
