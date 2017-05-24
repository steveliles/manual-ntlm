const ntlm = require('./lib/ntlm')

console.log('AUTH ' + ntlm.createType1Message({ domain: process.env.DOMAIN || '', workstation: process.env.WORKSTATION || '' }))
