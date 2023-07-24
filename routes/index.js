const router = require('express').Router();
const indexController = require('../controllers/indexController');
const { isAdmin } = require('../middlewares/isAdmin');
const { isAuth } = require('../middlewares/isAuth');



router.get('/index',indexController.getIndex);

module.exports = router;
