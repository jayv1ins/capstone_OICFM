const router = require('express').Router();
const dashboardController = require('../../controllers/analysis/dashboardController');

router.get('/dashboard', dashboardController.getDashboard);
// router.get("/api/filterData", dashboardController.filterData);

module.exports = router;