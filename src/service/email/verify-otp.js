const { getOTPDetails } = require("./get-otp-details");
const encryptPassword = require("../../utils/encryp-password");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (verifyEmail, otp) => {
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

    // OTP is valid, check if email matches
    if (storedOTP.email === verifyEmail) {
      const defaultPassword = "defaultPassword"; // You can change this to your desired default password
      const encryptedPassword = await encryptPassword(defaultPassword);

      // Update user's password in the database using Prisma
      try {
        await prisma.user.update({
          where: { email: verifyEmail },
          data: { password: encryptedPassword },
        });

        return {
          status: 200,
          message: `OTP verified successfully. Password has been reset to ${defaultPassword}`,
        };
      } catch (updateError) {
        console.error("Error updating password:", updateError);
        return {
          status: 500,
          message: "OTP verified, but failed to reset password.",
        };
      }
    } else {
      return { status: 400, message: "Email does not match the OTP request." };
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { status: 500, message: "Something went wrong." };
  } finally {
    await prisma.$disconnect();
  }
};
