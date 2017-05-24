if (!process.env.SMTP_USERNAME)
  throw new Error('export SMTP_USERNAME=your_email_username')
if (!process.env.SMTP_PASSWORD)
  throw new Error('export SMTP_PASSWORD=your_email_password')

const ntlm = require('./lib/ntlm')

const type2 = ntlm.parseType2Message('NTLM ' + process.argv[2], function(){
  console.log(arguments)
})

const type3 = ntlm.createType3Message(type2, {
  username: process.env.SMTP_USERNAME,
  password: process.env.SMTP_PASSWORD,
  domain: process.env.DOMAIN || '',
  workstation: process.env.WORKSTATION || ''
})

console.log()
console.log(type3.split(' ')[1])
