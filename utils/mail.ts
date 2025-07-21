import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export function sendEmail(to: string, subject: string, text: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    html: `<h1>${text}</h1>`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
