const router = require('express').Router();
const selectController = require('../../controllers/guns/selectController');
const { isAuth } = require('../../middlewares/isAuth');
const { isAdmin } = require('../../middlewares/isAdmin');

router.get('/select/:id', isAuth ,selectController.getSelect);

module.exports = router;
