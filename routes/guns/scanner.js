const router = require("express").Router();
const scannerController = require("../../controllers/guns/scannerController");
const { isAuth } = require("../../middlewares/isAuth");
const { isAdmin } = require("../../middlewares/isAdmin");
const multer = require("multer");

const storageOptions = multer.memoryStorage();
const upload = multer({ storage: storageOptions });

router.get("/scanner", isAuth, scannerController.scanner);
router.post(
  "/scan",
  upload.single("image"),
  isAuth,
  scannerController.scanUpdate
);

module.exports = router;
