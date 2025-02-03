const { Subscriber } = require("../models");
const catchAsyncError = require("../utils/catchAsyncError");

// ✅ Subscribe a User
exports.subscribe = catchAsyncError(async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // ✅ Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ where: { email } });
    if (existingSubscriber) {
      return res.status(400).json({ success: false, message: "Email already subscribed" });
    }

    // ✅ Create new subscriber
    const newSubscriber = await Subscriber.create({ email });

    res.status(201).json({ success: true, message: "Subscribed successfully", newSubscriber });
  } catch (error) {
    next(error);
  }
});

// ✅ Get All Subscribers
exports.getAllSubscribers = catchAsyncError(async (req, res, next) => {
  try {
    const subscribers = await Subscriber.findAll();
    res.status(200).json({ success: true, data: subscribers });
  } catch (error) {
    next(error);
  }
});

// ✅ Unsubscribe (Delete Subscriber)
exports.unsubscribe = catchAsyncError(async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // ✅ Check if subscriber exists
    const subscriber = await Subscriber.findOne({ where: { email } });
    if (!subscriber) {
      return res.status(404).json({ success: false, message: "Subscriber not found" });
    }

    await subscriber.destroy();
    res.status(200).json({ success: true, message: "Unsubscribed successfully" });
  } catch (error) {
    next(error);
  }
});
