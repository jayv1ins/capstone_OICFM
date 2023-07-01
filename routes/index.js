const router = require('express').Router();
const indexController = require('../controllers/indexController');

router.get('/index', indexController.getIndex);

module.exports = router;
