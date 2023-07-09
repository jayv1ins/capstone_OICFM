const router = require('express').Router();
const dTableController = require('../controllers/dTableController');
const { isAuth } = require('../middlewares/isAuth');
const { isAdmin } = require('../middlewares/isAdmin');

router.get('/DataTable',  dTableController.getDTable);
router.post("/delete/:id",  dTableController.deleteData);

module.exports = router;
