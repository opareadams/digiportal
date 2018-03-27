var nodemailer = require('nodemailer');


let dispatch = (emailMode,email,firstName,approvalLink,disapprovalLink,projectTitle,projectSummary) => {

  var htmlBody;
  var subject;

  if(emailMode == 1){//to approver
    emailSubject = 'Business  Support Request waiting for your approval';

    htmlBody='Hello '+firstName+', </p> A Business Support Request requires your approval. You can visit the <a href="http://www.yahoo.com">portal</a> to approve or reject  </p> </p>'+
    'Alternatively, you can click <a href="'+approvalLink+'">here</a> to approve or <a href="'+disapprovalLink+'">here</a> to disapprove </p> </br> '+
    ' <Strong>Request Details</Strong>  <p><Strong>Project Title:</Strong> '+projectTitle+' <br> <Strong> Project Summary: </Strong> '+projectSummary+' <br><br> C2 – Vodafone restricted '

  }
  else if(emailMode ==2){//email to requester after sending request
    emailSubject='Business Support Request submitted for approval';

    htmlBody='Hello '+firstName+', </p> Your  Business Support Request has been  submitted for approval. You can find further details on this and other requests by clicking <a href="http://www.google.com">here</a> </p> </br>'+    
    ' <Strong>Request Details</Strong>  <p><Strong>Project Title:</Strong> '+projectTitle+' <br> <Strong> Project Summary: </Strong> '+projectSummary+' <br><br> C2 – Vodafone restricted '
  }

  else if(emailMode == 3){//email confirming approval status
    emailSubject = 'Business Support Request Approval';

    htmlBody='Hello '+firstName+', </p> Your recent Business Support Request has been '+approvalLink+'. You can find further details on this and other requests by clicking <a href="http://www.google.com">here</a> </p> </br>'+    
    ' <Strong>Request Details</Strong>  <p><Strong>Project Title:</Strong> '+projectTitle+' <br> <Strong> Project Summary: </Strong> '+projectSummary+' <br><br> C2 – Vodafone restricted '
 
  }

  //--tcf
  else if(emailMode == 4){//TCF message to approver
    emailSubject = 'Tarrif Creation/Change Form Request waiting for your approval';

    htmlBody='Hello '+firstName+', </p> A Tarrif Creation/Change Form Reques requires your approval. You can visit the <a href="http://www.yahoo.com">portal</a> to approve or reject  </p> </p>'+
    'Alternatively, you can click <a href="'+approvalLink+'">here</a> to approve or <a href="'+disapprovalLink+'">here</a> to disapprove </p> </br> '+
    ' <Strong>Request Details</Strong>  <p><Strong>Project Title:</Strong> '+projectTitle+' <br> <Strong> Project Summary: </Strong> '+projectSummary+' <br><br> C2 – Vodafone restricted '

  }
  else if(emailMode ==5){//email to tcf requester after sending request
    emailSubject='Tarrif Creation/Change Form Request submitted for approval';

    htmlBody='Hello '+firstName+', </p> Your Tarrif Creation/Change Form Request has been  submitted for approval. You can find further details on this and other requests by clicking <a href="http://www.google.com">here</a> </p> </br>'+    
    ' <Strong>Request Details</Strong>  <p><Strong>Project Title:</Strong> '+projectTitle+' <br> <Strong> Project Summary: </Strong> '+projectSummary+' <br><br> C2 – Vodafone restricted '
  }

  else if(emailMode == 6){//email confirming approval status
    emailSubject = 'Tarrif Creation/Change Form Approval';

    htmlBody='Hello '+firstName+', </p> Your recent Tarrif Creation/Change Form has been '+approvalLink+'. You can find further details on this and other requests by clicking <a href="http://www.google.com">here</a> </p> </br>'+    
    ' <Strong>Request Details</Strong>  <p><Strong>Project Title:</Strong> '+projectTitle+' <br> <Strong> Project Summary: </Strong> '+projectSummary+' <br><br> C2 – Vodafone restricted '
 
  }


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
     pass: 'xxx'
  }
});

var mailOptions = {
   from: 'xxxxxx@vodafone.com',
   to: email,
  subject: emailSubject,
  html:  htmlBody
};

transporter.sendMail(mailOptions,  function(error, info){
  if (error) {
    console.log(error);
  } else {
      console.log('Email sent: ' + info.response);
  }
}); 

}

module.exports = {dispatch}