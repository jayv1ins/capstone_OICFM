const router = require('express').Router();
const homeController = require('../controllers/homeController');
const { isAuth } = require('../middlewares/isAuth');
const { isAdmin } = require('../middlewares/isAdmin');

router.get('/home',  homeController.getHome);
router.get("/delete:id",  homeController.deleteData);

module.exports = router;
