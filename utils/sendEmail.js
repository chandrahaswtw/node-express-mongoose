const sgMail = require("@sendgrid/mail");
const { SG_API_KEY, SG_EMAIL_ID } = process.env;
sgMail.setApiKey(SG_API_KEY);

module.exports.sendMail = async (to, subject, html) => {
  const msg = {
    to,
    from: SG_EMAIL_ID, // Use the email address or domain you verified above
    subject,
    html,
  };
  await sgMail.send(msg);
};
