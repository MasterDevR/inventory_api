const { getOTPDetails } = require("../service/email/get-otp-details");

module.exports = async (department_id, otp) => {
  try {
    const storedOTP = getOTPDetails();
    // Check if OTP exists
    if (!storedOTP) {
      return {
        status: 400,
        message: "No OTP found. Please request a new OTP.",
      };
    }

    // Check if OTP matches
    if (storedOTP.otp !== otp) {
      return { status: 400, message: "Invalid OTP." };
    }

    return { status: 200, message: "OTP verified successfully." };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { status: 500, message: "Something went wrong." };
  }
};
