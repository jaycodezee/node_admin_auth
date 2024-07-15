const nodemailer = require('nodemailer');

const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,// The recipient's email address
      subject: 'Password Reset',
      text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to: ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    // throw new Error('Error sending email');
  }
};

module.exports = sendPasswordResetEmail;
