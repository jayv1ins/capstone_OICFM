const router = require('express').Router();
const dashController = require('../../controllers/data/dashController');

router.get('/dash', dashController.getDash);

module.exports = router;
