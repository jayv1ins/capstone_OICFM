const router = require("express").Router();
const helpController = require("../controllers/helpController");
const { isAdmin } = require("../middlewares/isAdmin");
const { isAuth } = require("../middlewares/isAuth");

router.get("/help", isAuth, helpController.getHelp);

module.exports = router;
