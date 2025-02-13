const multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        const image = Date.now() + ".png";
        cb(null, image);
    }
})

module.exports = {
    multer,
    storage
}