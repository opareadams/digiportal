"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var sortApprovers = function(a, b) {
  // - negative a before b
  // 0 no change
  // + positive a after b
  if (a.approval === b.approval) {
    return b.updatedAt - a.updatedAt;
  }
  return b.approval - a.approval;
};

//APPROVERS SCHEMA
var ApproverSchema = new Schema(
	
		{
		name: String,
		email: String,
    department: String,
    level: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    approval:{type: Number, default: 0}
		}
		
);

ApproverSchema.method("update", function(updates, callback) {
  Object.assign(this, updates, { updatedAt: new Date() });
  this.parent().save(callback);
});

ApproverSchema.method("approve", function(approve, callback) {
  if (approve === "yes" && this.approval < 1) {
    this.approval += 1;
  } else if (approve === "no" && this.approval > 0) {
    this.approval -= 1;
  }
  this.parent().save(callback);
});




//BSA OVERVIEW SCHEMA
//All fields required for creating a BSA form
var BsaOverviewSchema = new Schema({
  projectTitle: String,
  projectSummary: String,  
  businessRationale: String,
  marketInsight: String,  
  objectives: String,
  requirements: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

BsaOverviewSchema.method("update", function(updates, callback) {
  Object.assign(this, updates, { updatedAt: new Date() });
  this.parent().save(callback);
});




//BSA DETAILS SCHEMA
//All fields required for creating a BSA form
var BsaDetailsSchema = new Schema(
  {
    details:[
      {
      department: String,
      projectRole: String,
      fte: String
      },
      {
      department:String,
      projectRole:String,
      fte:String
      },
      {
      department:String,
      projectRole:String,
      fte:String
      },
      {
      department:String,
      projectRole: String,
      fte: String
      }],
    summarizedFinancialImpact: String,
    deliverables:[
      {
        description: String,
        targetDate: String
      },
      {
        description:String,
        targetDate:String
      },
      {
        description:String,
        targetDate:String
      },
      {
        description:String,
        targetDate:String
      },
      {
        description:String,
        targetDate:String
      }],
    gatesAndMilestones:[
      {
        milestones:String,
        description:String,
        targetDate:String
      },
      {
        milestones:String,
        description:String,
        targetDate:String
      },
      {
        milestones:String,
        description:String,
        targetDate:String
      },
      {
        milestones:String,
        description:String,
        targetDate:String
      },
      {
        milestones:String,
        description:String,
        targetDate:String
      },
      {
        milestones:String,
        description:String,
        targetDate:String
      },
      {
        milestones:String,
        description:String,
        targetDate:String
      }]
  }
);

BsaDetailsSchema.method("update", function(updates, callback) {
  Object.assign(this, updates, { updatedAt: new Date() });
  this.parent().save(callback);
});


//PARENT FORM SCHEMA
var FormSchema = new Schema({
  title: String,
  type: String,
  createdAt: { type: Date, default: Date.now },
  approvers: [ApproverSchema],
  owner: String,
  bsaOverview: [BsaOverviewSchema],
  bsaDetails:[BsaDetailsSchema]
});

FormSchema.pre("save", function(next) {
  this.approvers.sort(sortApprovers);
  next();
});

var Form = mongoose.model("Form", FormSchema);

module.exports.Form = Form;
