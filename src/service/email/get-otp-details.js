const otpStore = {
  otp: null,
  email: null,
  expiresAt: null,
  setOTP: function (newOTP, newEmail) {
    this.otp = newOTP;
    this.email = newEmail;
    this.expiresAt = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes
  },
  getOTP: function () {
    return this.otp;
  },
  getEmail: function () {
    return this.email;
  },
  isValid: function () {
    return Date.now() < this.expiresAt;
  },
};

const setOTPDetails = (otp, email) => {
  console.log(otp, email);
  otpStore.setOTP(otp, email);
};

const getOTPDetails = () => ({
  otp: otpStore.getOTP(),
  email: otpStore.getEmail(),
  isValid: otpStore.isValid(),
});

module.exports = {
  setOTPDetails,
  getOTPDetails,
};
