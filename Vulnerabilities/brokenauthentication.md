# [Broken Authentication](https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication)

Broken Authentication is when some piece of the authentication and session management pipeline are implemented insecurely, allowing exploits which compromise passwords, keys, or other vulnerable authentication information.

## Our Implementation

Modern web development stacks make it somewhat easy to send and store passwords securely and reliably. Technologies such as HTTPS which use state of the art encryption are easy to set up and use for secure data communication over the network, and libraries such as `bcrypt` are easy to use for hashing passwords. 

In our app, we demonstrate a case of broken authentication by passing passwords via `GET` request query parameters in the insecure portion of our side. While this is [still secure over the network](https://stackoverflow.com/a/499594), URLs are very likely to be stored in insecure places such as one's browser history as well as server logs. In our case we use [`morgan`](https://github.com/expressjs/morgan) for generic site logging (which stores all hit URLs, but not the body of requests, which is standard). From an insecure login you will see plaintext usename and passwords, from the secure site, the information is obfuscated in a `POST` request.

An insecure request will look like the following (note the username and password).

```
Fri, 06 Nov 2020 05:42:15 GMT GET /loginUserInsecure?loginUsername=froglover420&pword=ilovefrogs 302
```

while a secure request will look like:
```
Fri, 06 Nov 2020 05:41:54 GMT POST /loginUser 302
```

Note that the above are relatively close to `morgan`'s default logging information, with excess details removed for simplicity.

## Steps to Exploit

1. From the insecure portion of our site, login as any user (`froglover420` / `ilovefrogs`)
2. Logout, go to the secure version, and login again with the same credentials
3. Logout once more, go to the secure version, and login again with `admin`/`admin`
4. Go to the admin panel
5. CTRL+F "froglover", to which you will find a `GET` query with both the plaintext username and password.
6. Note that the POST query shortly after (from the secure login) does not share this information

