const router = require('express').Router();
const logoutController = require('../controllers/logoutController');

router.get('/logout', logoutController.logout);

module.exports = router;
