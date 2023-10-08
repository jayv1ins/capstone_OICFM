const router = require('express').Router();
const registerController = require('../../controllers/accounts/registerController');

router.get('/register', registerController.index);
router.post('/register', registerController.register);

module.exports = router;
