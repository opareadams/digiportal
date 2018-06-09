"use strict";

var express = require("express");
var router = express.Router();
var Form = require("../models/formModels").Form;
var Form2 = require("../models/formModels").Form2;
var ldap = require("../models/ldapModel");
var sendEmail = require("../models/emailModel");

//Declaring BSA form variables
router.param("fID", function(req, res, next, id) { //fID means BSA form ID
  Form.findById(id, function(err, doc) {
    if (err) return next(err);
    if (!doc) {
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    req.form = doc;
    return next();
  });
});

router.param("aID", function(req, res, next, id) { //aID means BSA approver ID
  req.approver = req.form.approvers.id(id);
  if (!req.approver) {
    err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

router.param("oID", function(req, res, next, id) { //oID means BSA overview ID
  req.bsaOverview = req.form.bsaOverview.id(id);
  if (!req.bsaOverview) {
    err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});


router.param("dID", function(req, res, next, id) { //dID means BSA details ID
  req.bsaDetails = req.form.bsaDetails.id(id);
  if (!req.bsaDetails) {
    err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});


//Declaring the routes

// GET /forms
// Route for all forms collection
router.get("/", function(req, res, next) {
  Form.find({})
    .sort({ createdAt: -1 })
    .exec(function(err, forms) {
      if (err) return next(err);
      res.json(forms);
    });
});

// GET /forms/byOwner 
// Route for all forms collection based on criteria i.e Owner
router.get("/byOwner/:owner", function(req, res, next) {
  Form.find({"owner":req.params.owner})
    .sort({ createdAt: -1 })
    .exec(function(err, forms) {
      if (err) return next(err);
      res.json(forms);
    });
});

// GET /forms/byApprovers 
// Route for all forms collection based on criteria i.e approvers
router.get("/byApprovers/:approver", function(req, res, next) {
  Form.find({"approvers.email":req.params.approver})
    .sort({ createdAt: -1 })
    .exec(function(err, forms) {
      if (err) return next(err);
      res.json(forms);
    });
});


// POST /forms
// Route for creating forms
router.post("/", function(req, res, next) {
  var form = new Form(req.body);
  form.save(function(err, form) {
    if (err) return next(err);
    res.status(201);
    res.json(form);
  });
});

// GET /forms/:id
// Route for getting a specific form
router.get("/:fID", function(req, res, next) {
  res.json(req.form);
});



// Delete a specific form
router.delete("/:fID", function(req, res) {
  req.form.remove(function(err) {
    if (err) return next(err);
    Form.find({})
      .sort({ createdAt: -1 })
      .exec(function(err, forms) {
        if (err) return next(err);
        res.json(forms);
      });
  });
});


// Delete all forms
router.delete("/", function(req, res) {
  req.form.remove(function(err) {
    if (err) return next(err);
    Form.find({})
      .sort({ createdAt: -1 })
      .exec(function(err, forms) {
        if (err) return next(err);
        res.json(forms);
      });
  });
});
//------------------------------------------------------------------------------------
// POST /forms/:fID/bsa
// Route for adding bsa overview
router.post("/:fID/bsaOverview", function(req, res, next) {
  req.form.bsaOverview.push(req.body);
  req.form.save(function(err, form) {
    if (err) return next(err);
    res.status(201);
    res.json(form);
  });
});

// PUT /forms/:fID/bsaOverview/:oID
// Edit a specific BSA Overview
router.put("/:fID/bsaOverview/:oID", function(req, res) {
  req.bsaOverview.update(req.body, function(err, result) {
    if (err) return next(err);
    res.json(result);
  });
});

// POST /forms/:fID/bsa
// Route for adding bsa details
router.post("/:fID/bsaDetails", function(req, res, next) {
  req.form.bsaDetails.push(req.body);
  req.form.save(function(err, form) {
    if (err) return next(err);
    res.status(201);
    res.json(form);
  });
});

// PUT /forms/:fID/bsaDetails/:dID
// Edit a specific BSA Detail
router.put("/:fID/bsaDetails/:dID", function(req, res) {
  req.bsaDetails.update(req.body, function(err, result) { //req.bsaDetails is declared in the variables at the top of the codes
    if (err) return next(err);
    res.json(result);
  });
});
//------------------------------------------------------------------------------------



// POST /forms/:fID/approver
// Route for creating an approver
router.post("/:fID/approvers", function(req, res, next) {
  req.form.approvers.push(req.body);
  req.form.save(function(err, form) {
    if (err) return next(err);
/*
    //send email to approver for approval
    var jsonBody = JSON.stringify(req.body);
    var objectValue = JSON.parse(jsonBody); 
    
    //get firstname from email and capitalize first letter
    var email = objectValue['email'];
    var fname = email.substr(0, email.indexOf('.'));
    var firstName = fname.charAt(0).toUpperCase() + fname.slice(1);

    //getting project title and summary from form
    var approversArray=form.approvers;
    var projectTitle= form.bsaOverview[0].projectTitle;
    var projectSummary = form.bsaOverview[0].projectSummary;

    var approvalLink='http://10.233.217.228:3000/forms/'+req.params.fID+'/approvers/'+approversArray[0]._id+'/approve-yes';
    var disapprovalLink = 'http://10.233.217.228:3000/forms/'+req.params.fID+'/approvers/'+approversArray[0]._id+'/approve-no';

    sendEmail.dispatch(1,email,firstName,approvalLink,disapprovalLink,projectTitle,projectSummary);


    //--
    //send email to requester after sending request
    var email2 = form.owner;
    var fname2 = email2.substr(0, email2.indexOf('.'));
    var firstName2 = fname2.charAt(0).toUpperCase() + fname2.slice(1);
    sendEmail.dispatch(2,email2,firstName2,approvalLink,disapprovalLink,projectTitle,projectSummary);
*/

   // console.log(firstName)  //this helped me track down the approval_id of an approver
    res.status(201);
    res.json(form);
  });
});

// PUT /forms/:fID/approvers/:aID
// Edit a specific approver
router.put("/:fID/approvers/:aID", function(req, res) {
  req.approver.update(req.body, function(err, result) {
    if (err) return next(err);
    res.json(result);
  });
});

// DELETE /forms/:fID/approvers/:aID
// Delete a specific approver
router.delete("/:fID/approvers/:aID", function(req, res) {
  req.approver.remove(function(err) {
    req.form.save(function(err, form) {
      if (err) return next(err);
      res.json(form);
    });
  });
});

// GET /forms/:qID/approvers/:aID/approve-yes
// GET /forms/:qID/approvers/:aID/approve-no
// Approve by a specific approver
router.get(
  "/:fID/approvers/:aID/approve-:answer",
  function(req, res, next) {
    if (req.params.answer.search(/^(yes|no)$/) === -1) {
      var err = new Error("Not Found");
      err.status = 404;
      next(err);
    } else {
      req.approve = req.params.answer;
      next();
    }
  },
  function(req, res, next) {
    req.approver.approve(req.approve, function(err, form) {
      if (err) return next(err);

     // console.log(req.params.aID);

      var approvalStatus;
      var projectTitle= form.bsaOverview[0].projectTitle;
      var projectSummary = form.bsaOverview[0].projectSummary;

      if(req.approve === 'yes'){
        approvalStatus="approved";
      }
      else{
        approvalStatus="disapproved";
      }

        //send email to requester after approval has been made
      var email2 = form.owner;
      var fname2 = email2.substr(0, email2.indexOf('.'));
      var firstName2 = fname2.charAt(0).toUpperCase() + fname2.slice(1);
      sendEmail.dispatch(3,email2,firstName2,approvalStatus,"",projectTitle,projectSummary);




      //Process to Check if all levels of this approval level have approved and send form to next level
      ///////////////////////////////////////////////////////////////////////////////////////
     
      // console.log("requester's approval ID ="+req.params.aID);
      

      var objectValue = JSON.stringify(req.form); //getting form from request, we use req.form
      var jsonBody = JSON.parse(objectValue);  //objectValue holds the response of the form
   
      var approverObject = jsonBody.approvers.find(obj => obj._id === req.params.aID); //how to find object with ID
      console.log("Requester's approval level ="+approverObject.level);


      var nummberOfLevelXapprovers=0;
      var nextLevel=parseInt(approverObject.level)+1;

      console.log("Number of approvers ="+jsonBody.approvers.length);

      for(var i=0;i<jsonBody.approvers.length;i++){ //counting number of level X approvers where x is the level of the approver
         if(jsonBody.approvers[i].level ===approverObject.level){
          nummberOfLevelXapprovers++;
         }
      }

      console.log("Number of level "+approverObject.level+" approvers is "+nummberOfLevelXapprovers);

      var count=0;
      for(var i=0;i<jsonBody.approvers.length;i++){ //check to see if approval in the approver array is 1 and is by a level x approver and count
          if(jsonBody.approvers[i].approval==1 && jsonBody.approvers[i].level===approverObject.level ){
            count++;
          }
      }

      console.log("Total number of yes approvals is ="+count);

      if(count==nummberOfLevelXapprovers){ //if the count of yes approvals matches the number of level x approvers, send form to higher level
        
        console.log("emails will be sent to level "+nextLevel);
        count=0;//re-initialize count

        //Below must send email to level X+1 approvers
            for(var i=0;i<jsonBody.approvers.length;i++){   
        
              //    console.log("Approval status ="+ jsonBody.approvers[i].approval);
            
          
                  if(jsonBody.approvers[i].level===nextLevel.toString()){ //if the level of the approver is 1
                      //get firstname from email and capitalize first letter
                        var email = jsonBody.approvers[i].email; 
                        
                        var fname = email.substr(0, email.indexOf('.'));
                        var firstName = fname.charAt(0).toUpperCase() + fname.slice(1);
            
                        console.log("Sending emails to "+jsonBody.approvers[i].email);
            
                       var approvalLink='http://10.233.217.228:3000/forms/'+req.params.fID+'/approvers/'+jsonBody.approvers[i]._id+'/approve-yes';
                        var disapprovalLink = 'http://10.233.217.228:3000/forms/'+req.params.fID+'/approvers/'+jsonBody.approvers[i]._id+'/approve-no';

                        
                        sendEmail.dispatch(1,email,firstName,approvalLink,disapprovalLink,projectTitle,projectSummary);
                          }
            
                }


      }
      else{
        
        console.log("Not all level "+approverObject.level+" have approved yet. Email wont be sent to level "+nextLevel);
      }



      res.json(form);
    });
  }
);


//POST Authentication route
router.post("/authentication", function(req, res, next) {

  
  var jsonBody = JSON.stringify(req.body);
  var objectValue = JSON.parse(jsonBody); 

 
  var response;
  
  //perform ldap authentication
  ldap.authenticate(objectValue['email'], objectValue['password'])
    .then(()=>{
          console.log('successful');

          response = {
                          responseCode:"success",
                          email:objectValue['email']
                      };

          res.json(response);
    
    },
    ()=>{
          console.log('Error');

          response = {
                        responseCode:"failed"                        
                  };

          res.json(response);
    })

});



//GET Submit form i.e send alerts to approvers
//form/submitForm/:fID
router.get("/submitForm/:fID", function(req, res, next) {


    //send email to approver for approval 
    var objectValue = JSON.stringify(req.form); //getting form from request, we use req.form
    var jsonBody = JSON.parse(objectValue);  //objectValue holds the response of the form
    
   //getting project title and summary from form
   var approversArray=jsonBody.approvers;
   var projectTitle= jsonBody.bsaOverview[0].projectTitle;
   var projectSummary = jsonBody.bsaOverview[0].projectSummary;
    
//loop the size of the approvers array and fire emails to each email address of the approvers
    for(var i=0;i<jsonBody.approvers.length;i++){    
     
   

      if(jsonBody.approvers[i].level==="1"){ //if the level of the approver is 1
          //get firstname from email and capitalize first letter
            var email = jsonBody.approvers[i].email; 
            
            var fname = email.substr(0, email.indexOf('.'));
            var firstName = fname.charAt(0).toUpperCase() + fname.slice(1);

            console.log("Sending emails to "+jsonBody.approvers[i].email);

            var approvalLink='http://10.233.217.228:3000/forms/'+req.params.fID+'/approvers/'+approversArray[i]._id+'/approve-yes';
            var disapprovalLink = 'http://10.233.217.228:3000/forms/'+req.params.fID+'/approvers/'+approversArray[i]._id+'/approve-no';

            sendEmail.dispatch(1,email,firstName,approvalLink,disapprovalLink,projectTitle,projectSummary);
              }

    }
   
    //--
    //send one email to requester after sending request
    var email2 = jsonBody.owner;
    var fname2 = email2.substr(0, email2.indexOf('.'));
    var firstName2 = fname2.charAt(0).toUpperCase() + fname2.slice(1);
    sendEmail.dispatch(2,email2,firstName2,approvalLink,disapprovalLink,projectTitle,projectSummary);


  //  console.log(firstName)  //this helped me track down the approval_id of an approver
    res.status(201);
  res.json(req.form);
});




//---------------------ROUTES FOR TCF FORM ------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
router.param("tcffID", function(req, res, next, id) { //url parameter for tcf  form id
  Form2.findById(id, function(err, doc) {
    if (err) return next(err);
    if (!doc) {
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    req.form = doc;
    return next();
  });
});

router.param("tcfaID", function(req, res, next, id) { //url parameter for tcf approver ID
  req.approver = req.form.approvers.id(id);
  if (!req.approver) {
    err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

router.param("tcfdID", function(req, res, next, id) { //url parameter for tcf details ID
  req.tcfDetails = req.form.tcfDetails.id(id);
  if (!req.tcfDetails) {
    err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});



//------------------------------------------------

// GET /forms/:id
// Route for getting a specific form
router.get("/tcf/single/:tcffID", function(req, res, next) {
  res.json(req.form);
});




// GET /forms/tcf/all
// Route for all tcf  forms collection
router.get("/tcf/all", function(req, res, next) {
  Form2.find({})
  .sort({ createdAt: -1 })
  .exec(function(err, forms) {
    if (err) return next(err);
    res.json(forms);
  });
});




// POST /forms/tcf
// Route for creating forms
router.post("/tcf", function(req, res, next) {
  
  var form = new Form2(req.body); //keep adding this to refer form to TCF cos of the Form2

  form.save(function(err, form) {
    if (err) return next(err);
    res.status(201);
    res.json(form);
  });
});


//-------------------------------------------------------
// POST 
// Route for adding TCF details
router.post("/tcf/:tcffID/tcfDetails", function(req, res, next) {
  var form = new Form2(req.body); //keep adding this to refer form to TCF cos of the Form2

  req.form.tcfDetails.push(req.body);
  req.form.save(function(err, form) {
    if (err) return next(err);

    //----sending email to reviewer
  /*
     //send email to reviewer
     var jsonBody = JSON.stringify(req.body);
     var objectValue = JSON.parse(jsonBody); 
     
     //get firstname from email and capitalize first letter
     var email = objectValue['email'];
     var fname = email.substr(0, email.indexOf('.'));
     var firstName = fname.charAt(0).toUpperCase() + fname.slice(1);
 
     //getting project title and summary from form
     var approversArray=form.approvers;
     var projectTitle= form.tcfDetails[0].productTitle;
     var projectSummary = form.tcfDetails[0].productDescription;
 
     var approvalLink='http://10.233.217.228:3000/tcf/forms/'+req.params.fID+'/approvers/'+approversArray[0]._id+'/approve-yes';
     var disapprovalLink = 'http://10.233.217.228:3000/tcf/forms/'+req.params.fID+'/approvers/'+approversArray[0]._id+'/approve-no';
 
     sendEmail.dispatch(4,email,firstName,approvalLink,disapprovalLink,projectTitle,projectSummary); //email mode 4 for tcf approver
 */
    //-------------------------------


    res.status(201);
    res.json(form);
  });
});

// PUT /form/tcf/:tcffID/tcfDetails/:tcfdID
// Edit a TCF details
router.put("/tcf/:tcffID/tcfDetails/:tcfdID", function(req, res) {
  req.tcfDetails.update(req.body, function(err, result) {
    if (err) return next(err);
    res.json(result);
  });
});
//-------------------------------------------------------


// GET /forms/tcf/byOwner 
// Route for all forms collection based on criteria i.e Owner
router.get("/tcf/byOwner/:owner", function(req, res, next) {
  Form2.find({"owner":req.params.owner}) //Note that Form2 is the TCF form schema
    .sort({ createdAt: -1 })
    .exec(function(err, forms) {
      if (err) return next(err);
      res.json(forms);
    });
});

// GET /forms/byApprovers 
// Route for all forms collection based on criteria i.e approvers
router.get("/tcf/byApprovers/:approver", function(req, res, next) {
  Form2.find({"approvers.email":req.params.approver})
    .sort({ createdAt: -1 })
    .exec(function(err, forms) {
      if (err) return next(err);
      res.json(forms);
    });
});


// Delete a specific form
router.delete("/tcf/:tcffID", function(req, res) {
  req.form.remove(function(err) {
    if (err) return next(err);
    Form2.find({}) //Form2 is the schema for TCF form
      .sort({ createdAt: -1 })
      .exec(function(err, forms) {
        if (err) return next(err);
        res.json(forms);
      });
  });
});



//----- TCF Approvers

//POST
//Route for adding TCF Approvers
router.post("/tcf/:tcffID/approvers", function(req, res, next) {
  req.form.approvers.push(req.body);
  req.form.save(function(err, form) {
    if (err) return next(err);

/*

    //send email to approver for approval
    var jsonBody = JSON.stringify(req.body);
    var objectValue = JSON.parse(jsonBody); 
    
    //get firstname from email and capitalize first letter
    var email = objectValue['email'];
    var fname = email.substr(0, email.indexOf('.'));
    var firstName = fname.charAt(0).toUpperCase() + fname.slice(1);

    //getting project title and summary from form
    var approversArray=form.approvers;
    var projectTitle= form.tcfDetails[0].productTitle;
    var projectSummary = form.tcfDetails[0].productDescription;

    var approvalLink='http://10.233.217.228:3000/tcf/forms/'+req.params.fID+'/approvers/'+approversArray[0]._id+'/approve-yes';
    var disapprovalLink = 'http://10.233.217.228:3000/tcf/forms/'+req.params.fID+'/approvers/'+approversArray[0]._id+'/approve-no';

    sendEmail.dispatch(4,email,firstName,approvalLink,disapprovalLink,projectTitle,projectSummary); //email mode 4 for tcf approver


    //--
    //send email to requester after sending request
    var email2 = form.owner;
    var fname2 = email2.substr(0, email2.indexOf('.'));
    var firstName2 = fname2.charAt(0).toUpperCase() + fname2.slice(1);

    sendEmail.dispatch(5,email2,firstName2,approvalLink,disapprovalLink,projectTitle,projectSummary);//email mode 5 for tcf requester


   // console.log(firstName)  //this helped me track down the approval_id of an approver

   */
    res.status(201);
    res.json(form);
  });
});

// PUT /forms/tcf/:tcffID/approvers/:tcfaID
// Edit a specific approver
router.put("/tcf/:tcffID/approvers/:tcfaID", function(req, res) {
  req.approver.update(req.body, function(err, result) {
    if (err) return next(err);
    res.json(result);
  });
});


// GET /forms/:qID/approvers/:aID/approve-yes
// GET /forms/:qID/approvers/:aID/approve-no
// Approve TCF by a specific approver
router.get(
  "/tcf/:tcffID/approvers/:tcfaID/approve-:answer",
  function(req, res, next) {
    if (req.params.answer.search(/^(yes|no)$/) === -1) {
      var err = new Error("Not Found");
      err.status = 404;
      next(err);
    } else {
      req.approve = req.params.answer;
      next();
    }
  },
  function(req, res, next) {
    req.approver.approve(req.approve, function(err, form) {
      if (err) return next(err);

      console.log(req.params.aID);

      var approvalStatus;
      var projectTitle= form.tcfDetails[0].productTitle;
      var projectSummary = form.tcfDetails[0].productDescription;

      if(req.approve === 'yes'){
        approvalStatus="approved";
      }
      else{
        approvalStatus="disapproved";
      }

        //send email to requester after approval has been made
      var email2 = form.owner;
      var fname2 = email2.substr(0, email2.indexOf('.'));
      var firstName2 = fname2.charAt(0).toUpperCase() + fname2.slice(1);
      sendEmail.dispatch(6,email2,firstName2,approvalStatus,"",projectTitle,projectSummary);

      res.json(form);
    });
  }
);



//GET Submit TCF form i.e send alerts to approvers
//form/tcf/submitForm/:fID
router.get("/tcf/submitForm/:tcffID", function(req, res, next) {


  //send email to approver for approval
  var objectValue = JSON.stringify(req.form);
  var jsonBody = JSON.parse(objectValue);  //objectValue holds the response of the form
  
 //getting project title and summary from form
 var approversArray=jsonBody.approvers;
 var projectTitle= jsonBody.tcfDetails[0].productTitle;
 var projectSummary = jsonBody.tcfDetails[0].productDescription;
  
//loop the size of the approvers array and fire emails to each email address of the approvers
  for(var i=0;i<jsonBody.approvers.length;i++){ 
    console.log(jsonBody.approvers[i].email);

        //get firstname from email and capitalize first letter
  var email = jsonBody.approvers[i].email; 
  
  var fname = email.substr(0, email.indexOf('.'));
  var firstName = fname.charAt(0).toUpperCase() + fname.slice(1);

  

  var approvalLink='http://10.233.217.228:3000/tcf/forms/'+req.params.fID+'/approvers/'+approversArray[i]._id+'/approve-yes';
  var disapprovalLink = 'http://10.233.217.228:3000/tcf/forms/'+req.params.fID+'/approvers/'+approversArray[i]._id+'/approve-no';

  sendEmail.dispatch(4,email,firstName,approvalLink,disapprovalLink,projectTitle,projectSummary);


  }
 
  //--
  //send one email to requester after sending request
  var email2 = jsonBody.owner;
  var fname2 = email2.substr(0, email2.indexOf('.'));
  var firstName2 = fname2.charAt(0).toUpperCase() + fname2.slice(1);
  sendEmail.dispatch(5,email2,firstName2,approvalLink,disapprovalLink,projectTitle,projectSummary);


//  console.log(firstName)  //this helped me track down the approval_id of an approver
  res.status(201);
res.json(req.form);
});

module.exports = router;
