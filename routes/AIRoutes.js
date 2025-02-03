const express = require("express");
const router = express.Router();
const ImageController = require("./../controller/ImageController");

const {
    multer,
    storage
} = require("../utils/multer");

const upload = multer({
    storage: storage
})


router.post("/image_upload", upload.single('image_upload'), ImageController.save_image);



module.exports = router;
