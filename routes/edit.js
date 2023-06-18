const router = require('express').Router();
const editController = require('../controllers/editController');
const { isAuth } = require('../middlewares/isAuth');
const { isAdmin } = require('../middlewares/isAdmin');

router.get('/edit/:id', isAuth, isAdmin, editController.getEdit);
router.post('/edit/:id', isAuth, isAdmin, editController.updatedData);

module.exports = router;
