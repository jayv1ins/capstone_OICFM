const router = require('express').Router();
const createController = require('../../controllers/guns/createController');

router.get('/create',  createController.getCreate);
router.post('/create', createController.postCreate);

module.exports = router;
