const router = require('express').Router();
const tableC = require('../../../controllers/accounts/admin/tableC');
const { isAuth } = require('../../../middlewares/isAuth');
const { isAdmin } = require('../../../middlewares/isAdmin');

router.get('/admin/table',  isAuth, isAdmin ,tableC.getDTable);
router.post("/admin/delete/:id",  isAuth, isAdmin, tableC.deleteManager);

module.exports = router;
