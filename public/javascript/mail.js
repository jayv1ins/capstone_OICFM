// email.js
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  "999580329973-dk05g7t17ocp02u065mt20j7ioocb63e.apps.googleusercontent.com",
  "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",
  "http://localhost:3000/admin/create" // This can be any URL, even localhost
);

// Set credentials to get an access token
oauth2Client.setCredentials({
  refresh_token: "1//04rGzmLxb9NsJCgYIARAAGAQSNwF-L9IrWAAk9BkE5zvlNq6En2bKYmUTPmL2OSMLjb40DYIfbdHAGnWPrV9jPRi4sckpJl4vOyw",
});


const accessToken = oauth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "1447testerst@gmail.com",
    clientId: "999580329973-dk05g7t17ocp02u065mt20j7ioocb63e.apps.googleusercontent.com",
    clientSecret: "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",
    refreshToken: "1//04rGzmLxb9NsJCgYIARAAGAQSNwF-L9IrWAAk9BkE5zvlNq6En2bKYmUTPmL2OSMLjb40DYIfbdHAGnWPrV9jPRi4sckpJl4vOyw",
    accessToken: accessToken,
  },
});



// Function to send manager credentials email
exports.sendManagerCredentials = async (toEmail, policeId, password) => {
  const mailOptions = {
    from: '1447testerst@gmail.com',
    to: toEmail,
    subject: 'Manager Account Credentials',
    text: `Hello,\n\nYour manager account has been created with the following credentials:
    \n
    \nPolice ID: ${policeId}
    \nPassword: ${password}
    \n
    \nPlease keep these credentials secure and make sure to change password.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
