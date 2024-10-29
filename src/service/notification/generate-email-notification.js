var nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (email, status) => {
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SERVICE_EMAIL,
        pass: process.env.SERVICE_PASSWORD,
      },
    });

    let messageBody;

    if (status === "approved") {
      messageBody = `
        <h2>Congratulations!</h2>
        <p>Your request has been <strong style="color: Green;">approved</strong>.</p>
        <p>You can now proceed with the next steps. If you have any questions, feel free to contact us.</p>
      `;
    } else if (status === "rejected") {
      messageBody = `
        <h2>Request Update</h2>
        <p>Unfortunately, your request has been <strong style="color: red;">rejected</strong>.</p>
        <p>Please contant administration for more details.</p>
      `;
    } else if (status === "ready") {
      messageBody = `
        <h2>Good News!</h2>
        <p>Your request is <strong style="color: blue;">ready</strong>.</p>
        <p>You can now proceed to collect or review the requested items. For more details, contact our team.</p>
      `;
    } else {
      messageBody = `
        <h2>Request Status</h2>
        <p>The status of your request is: <strong>${
          status || "Unknown"
        }</strong>.</p>
      `;
    }

    var mailOptions = {
      from: process.env.SERVICE_EMAIL,
      to: email,
      subject: "Request Status Update - No Reply",
      html: `
        ${messageBody}
        <br>
        <p>Best regards,</p>
        <p>Your Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    return { status: 500, message: "Something went wrong." };
  }
};
