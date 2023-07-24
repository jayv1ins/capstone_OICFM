const router = require('express').Router();
const testController = require('../../controllers/analysis/testController');

router.get('/test',  testController.getTest);
router.post('/test', testController.postTest);
router.get('/view',  testController.ViewTest);

module.exports = router;
