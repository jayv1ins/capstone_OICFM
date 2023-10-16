const router = require('express').Router();
const createController = require('../../controllers/guns/createController');
const { isAuth } = require('../../middlewares/isAuth');
const { isAdmin } = require('../../middlewares/isAdmin');

router.get('/create',  isAuth ,createController.getCreate);
router.post('/create', isAuth ,createController.postCreate);



module.exports = router;
