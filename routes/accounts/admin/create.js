const router = require('express').Router();
const createC = require('../../../controllers/accounts/admin/createC');

router.get('/admin/create', createC.index);
router.post('/admin/create', createC.postCreate);

module.exports = router;
