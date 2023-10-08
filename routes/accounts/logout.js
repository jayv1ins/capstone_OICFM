const router = require('express').Router();
const logoutController = require('../../controllers/accounts/logoutController');

router.get('/logout', logoutController.logout);

module.exports = router;
