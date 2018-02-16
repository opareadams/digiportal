var ldap = require('ldapjs');

function authDN(dn, password, cb) {
  var client = ldap.createClient({url: 'ldap://10.74.161.9:389'});

  client.bind(dn, password, function (err) {
    client.unbind();
    cb(err === null, err);
  });
}


function output(res, err) {
  if (res) {
    console.log('success');
  } else {
    console.log('failure');
  }
}

// should print "success"
authDN('opare.adams1@vodafone.com', 'P@$$w0rd', output);
// should print "failure"
//authDN('cn=user', 'badpasswd', output);
