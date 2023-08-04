const router = require('express').Router();
const scannerController = require('../../controllers/guns/scannerController');


router.get('/scanner',  scannerController.scanner);
router.post('/scan', scannerController.scanUpdate);

module.exports = router;
