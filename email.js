var nodemailer = require('nodemailer');

var transporter =  nodemailer.createTransport({
   
    host: '00.00.00.00',
    port: 25,
    secure: false, // true for 465, false for other ports
    requireTLS: true, //Force TLS
    tls: {
        rejectUnauthorized: false
    },
 // service: 'gmail',
  auth: {
     user: 'xxxx',
     pass: 'xxxx'
  }
});

var mailOptions = {
   from: 'xxxx@vodafone.com',
   to: 'xxx@vodafone.com',
  subject: 'Sending Email using Node.js',
  text:  'That was easy!'
};

transporter.sendMail(mailOptions,  function(error, info){
  if (error) {
    console.log(error);
  } else {
      console.log('Email sent: ' + info.response);
  }
}); 