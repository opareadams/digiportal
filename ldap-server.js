'use strict'

//var ldap=require('./models/ldapModel');
var ldap = require("./models/ldapModel");

ldap.authenticate('opare.adams1@vodafone.com','P@$$w0rqd').then(()=>console.log('successful'),()=>console.log('Error'))