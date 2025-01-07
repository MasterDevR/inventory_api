const nodemailer = require("nodemailer");
const { setOTPDetails } = require("./get-otp-details");
const findEmail = require("../../utils/find-email");
// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SERVICE_EMAIL,
    pass: process.env.SERVICE_PASSWORD,
  },
});

// Function to generate a 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

module.exports = async (departmentId) => {
  try {
    const email = await findEmail(departmentId);
    if (email.status === 404 || email.status === 500) {
      return email;
    }
    // Generate and set OTP details
    const otp = generateOTP();
    setOTPDetails(otp, email.email);

    // Prepare email options
    const mailOptions = {
      from: process.env.SERVICE_EMAIL,
      to: email.email,
      subject: "Verification Code for Your Request",
      text: `Dear User,\n\nYour One-Time Password (OTP) is: ${otp}\n\nPlease use this code within the next 10 minutes to complete your request. If you did not initiate this request, please ignore this email or contact support immediately.\n\nThank you,\nSupply and Equipment Office\nUniversidad de Manila`,
    };

    // Send the OTP via email
    await transporter.sendMail(mailOptions);
    console.log("email sent ", email.email);
    console.log(otp);
    return {
      status: 200,
      message:
        "A verification code has been sent to your email address. Please check your inbox and use the code to proceed.",
    };
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    return {
      status: 500,
      message:
        "We encountered an error while trying to send the verification code. Please try again later.",
    };
  }
};
