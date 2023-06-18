const router = require('express').Router();
const loginController = require('../controllers/loginController');

router.get('/login', loginController.index);
router.post('/login', loginController.login);

module.exports = router;
