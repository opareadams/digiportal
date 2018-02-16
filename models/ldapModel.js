'use strict'
const ldapjs=require('ldapjs')
//const ldapConfig = require('./config')

const ldapOptions = {
    url: "ldap://10.74.161.9:389",
    connectTimeout: 3000,
    reconnect: true
}


let authenticate = (email,password) => {
    return new Promise((resolve, reject) =>{

        const ldapClient = ldapjs.createClient(ldapOptions)

        ldapClient.bind(email,password,(err,res)=>{
                if(err){
                    return reject(err)
                }
                ldapClient.unbind()
                return resolve(res)
            }

        )
    })
}

module.exports = {authenticate}