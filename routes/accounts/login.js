const router = require('express').Router();
const loginController = require('../../controllers/accounts/loginController');

router.get('/login', loginController.index);
router.post('/login', loginController.login);

module.exports = router;
