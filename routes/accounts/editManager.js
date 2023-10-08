const router = require('express').Router();
const editManager = require('../../controllers/accounts/editManagerC');
const { isAuth } = require('../../middlewares/isAuth');
const { isAdmin } = require('../../middlewares/isAdmin');

router.get('/profile/:id',  isAuth ,editManager.getEdit);
router.post('/profile/:id', isAuth, editManager.updatedData);

module.exports = router;
// isAuth, isAdmin,