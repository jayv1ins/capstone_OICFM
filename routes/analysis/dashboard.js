const router = require('express').Router();
const dashboardController = require('../../controllers/analysis/dashboardController');

router.get('/dashboard', dashboardController.getDashboard);

module.exports = router;