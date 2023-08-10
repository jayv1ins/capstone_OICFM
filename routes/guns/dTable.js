const router = require('express').Router();
const dTableController = require('../../controllers/guns/dTableController');
const { isAuth } = require('../../middlewares/isAuth');
const { isAdmin } = require('../../middlewares/isAdmin');

router.get('/DataTable',  isAuth ,dTableController.getDTable);
router.post("/delete/:id",  isAuth ,dTableController.deleteData);

module.exports = router;
