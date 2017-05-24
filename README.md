A couple of little scripts that help with manual testing SMTP servers using NTLM authentication. The scripts handle generating the initial handshake and responding to the server challenge. Some background here: http://davenport.sourceforge.net/ntlm.html

If your SMTP server supports unencrypted authentication you can use telnet, e.g.

```
> telnet mail.my.domain.com 25
Trying 1.2.3.4...
Connected to mail.my.domain.com.
Escape character is '^]'.
220 MailServer.my.domain.com Microsoft ESMTP MAIL Service ready at Wed, 24 May 2017 12:58:07 +0300
```

Then you say hi, for the email domain you're planning to test, e.g.:

```
> ehlo mymaildomain.com
```

and the server will respond with your options, e.g.

```
250-MailServer.my.domain.com Hello [1.2.3.4]
250-SIZE 37748736
250-PIPELINING
250-DSN
250-ENHANCEDSTATUSCODES
250-STARTTLS
250-X-ANONYMOUSTLS
250-AUTH NTLM
250-X-EXPS GSSAPI NTLM
250-8BITMIME
250-BINARYMIME
250-CHUNKING
250 XRDST
```

If you see AUTH NTLM in the list you're good to go. If not, and if STARTTLS is in the list, try over TLS:

```
> openssl s_client -starttls smtp -crlf -connect mail.my.domain.com:25
... whole bunch of output, elided for brevity ...
ehlo mymaildomain.com
250-MailServer.my.domain.com Hello [1.2.3.4]
250-SIZE 37748736
250-PIPELINING
250-DSN
250-ENHANCEDSTATUSCODES
250-AUTH NTLM LOGIN
250-X-EXPS GSSAPI NTLM
250-8BITMIME
250-BINARYMIME
250-CHUNKING
250 XRDST
```

Assuming you see AUTH NTLM in your output, you're on the way.

You need to export a few env variables - its easier this way than writing lots of command-line params, and you need to be reasonably quick running the steps so that you can respond to the server challenges before it times you out.

At a minimum you'll need SMTP_USERNAME and SMTP_PASSWORD, e.g.

```
export SMTP_USERNAME=myusername
export SMTP_PASSWORD=mypassword
```

You might need to set values for DOMAIN and WORKSTATION too - depending on your situation. Leaving these blank works for me.

Generate the initial handshake:

```
> node step1
AUTH NTLM TlRMTVNTUAABAAAAB7IIogMAAwArAAAAAwADACgAAAAFASgKAAAAD0ZPT0JBUg==
```

Paste the output directly into your conversation with the SMTP server. It will respond with the challenge, e.g.:

```
334 TlRMTVGHGHDHDHHSHSHSgAAAAFgomi8hHG6kQYeJMAAAAAAAAAAJAAkABAAAAABgOAJQAAAA9NAE8AQwBJAAIACABNAE8AQwBJAAEAEAB12345VJWEVIWBJAEMABAAWAG0AbwBjAGkALgBnAG8AdgAuAHMAYFHWHF0FHWHWF4FJFJFJQAaQBjAC4AbQBvAGMAacwBwAGHEF877mwWEF89
```

Copy the long string (but not the "334 " part), and pass that into step 2, e.g.

```
> node step2 TlRMTVGHGHDHDHHSHSHSgAAAAFgomi8hHG6kQYeJMAAAAAAAAAAJAAkABAAAAABgOAJQAAAA9NAE8AQwBJAAIACABNAE8AQwBJAAEAEAB12345VJWEVIWBJAEMABAAWAG0AbwBjAGkALgBnAG8AdgAuAHMAYFHWHF0FHWHWF4FJFJFJQAaQBjAC4AbQBvAGMAacwBwAGHEF877mwWEF89
```

which will produce another long string which you need to copy-paste back into your SMTP conversation, completing the authentication process.
