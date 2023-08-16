const router = require('express').Router();
const createC = require('../../../controllers/accounts/admin/createC');
const { isAuth } = require('../../../middlewares/isAuth');
const { isAdmin } = require('../../../middlewares/isAdmin');

router.get('/admin/create', isAuth, isAdmin ,createC.index);
router.post('/admin/create', isAuth, isAdmin ,createC.postCreate);

module.exports = router;
