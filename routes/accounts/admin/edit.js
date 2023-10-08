const router = require('express').Router();
const editC = require('../../../controllers/accounts/admin/editC');
const { isAuth } = require('../../../middlewares/isAuth');
const { isAdmin } = require('../../../middlewares/isAdmin');

router.get('/admin/edit/:id',  isAuth ,editC.getEdit);
router.post('/admin/edit/:id', isAuth ,editC.updatedData);

module.exports = router;
// isAuth, isAdmin,