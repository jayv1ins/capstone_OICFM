const router = require("express").Router();
const dashboardController = require("../../controllers/analysis/dashboardController");
const { isAuth } = require("../../middlewares/isAuth");
const { isAdmin } = require("../../middlewares/isAdmin");

router.get("/dashboard", isAuth, dashboardController.getDashboard);

module.exports = router;
