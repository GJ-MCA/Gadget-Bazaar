const nodemailer = require('nodemailer');
const emailConfig = require('../../src/config/email');
const config = require('../../src/config/config');
const transporter = nodemailer.createTransport({
  service: emailConfig.emailService,
  auth: {
    user: emailConfig.emailAddress,
    pass: emailConfig.emailPassword
  }
});

const sendEmail = async (nameArg, toArg, subjectArg, htmlArg) => {
  const mailOptions = {
    from: `${config.gadgetBazaarTitle} <${emailConfig.emailAddress}>`,
    to: toArg,
    subject: `${subjectArg} - ${config.gadgetBazaarTitle}`,
    html: `<h3> ${emailConfig.prefixText} ${nameArg},  </h3>
           ${htmlArg}
           ${emailConfig.postfixText}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${toArg}`);
  } catch (error) {
    console.error(`Error sending email to ${toArg}: ${error.message}`);
  }
};

module.exports = { sendEmail };
