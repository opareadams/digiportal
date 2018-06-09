var nodemailer = require('nodemailer');

var transporter =  nodemailer.createTransport({
    
  //  host: '145.230.101.26',
    host: 'appsmtp-north.internal.vodafone.com',
    port: 25, // port for secure SMTP
    secure: false, // true for 465, false for other ports
    requireTLS: true, //Force TLS
    tls: {
        rejectUnauthorized: false
        //cipher:'SSLv3'
    },
 // service: 'gmail',
  auth: {
     user: 'GHSVC.BRP',
     pass: 'Vod@f0ne001*'
  }
});

var mailOptions = {
   from: 'BusinessRequests.gh@vodafone.com',
   to: 'opare.adams1@vodafone.com',
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