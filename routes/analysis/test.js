const router = require('express').Router();
const testController = require('../../controllers/analysis/testController');


router.get('/test',  testController.getTest);

module.exports = router;
