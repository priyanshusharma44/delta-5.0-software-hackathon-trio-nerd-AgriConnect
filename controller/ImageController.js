const catchAsyncError = require("../utils/catchAsyncError");

exports.save_image = catchAsyncError(async (req, res) => {

    const file = req.file;
    
    console.log("Hello")
    res.status(200).json({
        status: "success",
        path: file
    });
});