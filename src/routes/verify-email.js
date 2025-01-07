const verifyEmail = require("../service/email/verify-email");
const sendOTP = require("../service/email/send-otp");

module.exports = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const result = await verifyEmail(email);
  if (result.status === 200) {
    const sendOTPResult = await sendOTP(email);
    res.send(sendOTPResult);
  } else {
    res.send(result);
  }
};
