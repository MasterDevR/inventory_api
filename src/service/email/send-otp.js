const nodemailer = require("nodemailer");
const { setOTPDetails } = require("./get-otp-details");

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SERVICE_EMAIL,
    pass: process.env.SERVICE_PASSWORD,
  },
});

module.exports = async (email) => {
  try {
    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setOTPDetails(otp, email);

    // Send the OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for verification",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    return { status: 200, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { status: 500, message: "Failed to send OTP" };
  }
};
