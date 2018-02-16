"use strict";

var express = require("express");
var router = express.Router();
var Form = require("../models/formModels").Form;
var ldap = require("../models/ldapModel");

router.param("fID", function(req, res, next, id) {
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

router.param("aID", function(req, res, next, id) {
  req.approver = req.form.approvers.id(id);
  if (!req.approver) {
    err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

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
//------------------------------------------------------------------------------------



// POST /forms/:fID/approver
// Route for creating an approver
router.post("/:fID/approvers", function(req, res, next) {
  req.form.approvers.push(req.body);
  req.form.save(function(err, form) {
    if (err) return next(err);

    //send email to approver for approval

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


module.exports = router;
