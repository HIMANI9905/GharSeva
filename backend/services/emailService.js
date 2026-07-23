const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter (using SMTP settings or fallback ethereal test account)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_EMAIL || 'demo_email',
      pass: process.env.SMTP_PASSWORD || 'demo_password'
    }
  });

  const message = {
    from: `${process.env.FROM_NAME || 'HomeEase AI'} <${process.env.FROM_EMAIL || 'noreply@homeease.ai'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.warn('Nodemailer simulation notice:', error.message);
    return { mock: true };
  }
};

module.exports = sendEmail;
