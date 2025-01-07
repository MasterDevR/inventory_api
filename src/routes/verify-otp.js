const verifyOTP = require("../service/email/verify-otp");

module.exports = async (req, res) => {
  try {
    const { verifyEmail, otp } = req.body;
    const result = await verifyOTP(verifyEmail, otp);
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
};
