const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Check if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('SMTP configuration is missing. Logging email details instead:');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body: ${options.text}`);
    return; // Fallback silently
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const message = {
    from: `"Business Website Inquiry" <noreply@business.com>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
