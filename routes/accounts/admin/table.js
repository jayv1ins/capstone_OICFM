const router = require('express').Router();
const tableC = require('../../../controllers/accounts/admin/tableC');
const { isAuth } = require('../../../middlewares/isAuth');
const { isAdmin } = require('../../../middlewares/isAdmin');

router.get('/admin/table',  tableC.getDTable);
router.post("/admin/table/delete/:id",  tableC.deleteData);

module.exports = router;
