const express = require("express");
const multer = require("multer");

const router = express.Router();

const { uploadImage } = require("../controllers/uploadController");

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/", upload.single("image"), uploadImage);

module.exports = router;