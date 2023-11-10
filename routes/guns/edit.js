const router = require("express").Router();
const editController = require("../../controllers/guns/editController");
const { isAuth } = require("../../middlewares/isAuth");
const { isAdmin } = require("../../middlewares/isAdmin");

router.get("/edit/:id", isAuth, editController.getEdit);
router.post("/update/:id", isAuth, editController.updatedData);

module.exports = router;
// isAuth, isAdmin,
