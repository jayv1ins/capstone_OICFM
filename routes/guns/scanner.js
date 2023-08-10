const router = require('express').Router();
const scannerController = require('../../controllers/guns/scannerController');
const { isAuth } = require('../../middlewares/isAuth');
const { isAdmin } = require('../../middlewares/isAdmin');

router.get('/scanner',  isAuth ,scannerController.scanner);
router.post('/scan', isAuth ,scannerController.scanUpdate);

module.exports = router;
