const { Subscriber } = require("../models");
const sendMail = require("../services/sendEmail");
const catchAsyncError = require("../utils/catchAsyncError");

const notifySubscribers = catchAsyncError(async (post) => {
  try {
    const subscribers = await Subscriber.findAll();
    const emails = subscribers.map((sub) => sub.email);

    if (emails.length === 0) {
      console.log("No subscribers to notify");
      return;
    }

    const mailOptions = {
      subject: `New Post: ${post.title}`,
      html: `<p>Check out our latest post: <a href="http://localhost:5173/blog/${post.id}">${post.title}</a></p>`,
    };

    await sendMail(emails, mailOptions.subject, mailOptions.html);
    console.log(`Notification sent to ${emails.length} subscribers`);
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
});

module.exports = notifySubscribers;
