var nodemailer = require('nodemailer');

module.exports = class Email
{
    constructor()
    {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'assem.alsahel@gmail.com',
            pass: 'pass'
          }
        });
    }
    
    sendEmail(from, to, subject, html)
    {
        let mailOptions = {
          from: from,
          to:  to,
          subject: subject,
          html: html
        };
        
        this.transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
    }
}