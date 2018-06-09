var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport('SMTP', {debug: true});

var mailOptions = {
    from: 'BusinessRequests.gh@vodafone.com',
    to: 'opare.adams1@vodafone.com',
   subject: 'Sending Email using Node.js',
   text:  'That was easy!'
 };
 
 transport.sendMail(mailOptions,  function(error, info){
   if (error) {
     console.log(error);
   } else {
       console.log('Email sent: ' + info.response);
   }
 }); 