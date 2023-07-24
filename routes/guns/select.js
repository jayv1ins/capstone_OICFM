const router = require('express').Router();
const selectController = require('../../controllers/guns/selectController');

router.get('/select/:id', selectController.getSelect);

module.exports = router;
