# [XML External Entities](https://owasp.org/www-project-top-ten/2017/A1_2017-Injection)

The XML External Entity vulnerability is when an xml file contains an external entity which is then expanded/evaluated by a parser.
This entity can access the server's file system and retrieve restricted data.

## Our Implementation

We had to fabricate a reason to use xml in our application since we would just use json for communication in a real banking app.
We decided to add a functionality to the admin page that allows the admin to create a new user account using an xml file upload.

## Steps to Exploit

1. From the insecure portion of our site, login as any non-admin user (`froglover420` / `ilovefrogs`)
2. Once logged in, go to `/Admin`
3. Download and select the vulnerable [xml file](https://github.com/martinky24/WebsiteSecurity/blob/main/newAccount_malicious.xml) with the `Choose File` option
4. Click `Upload`, wait for the `New user successfully created` alert
5. Logout and sign in to the newly created account (`new` / `new`)
6. Navigate to `/account` and look for the substituted server value (`&xxe;` replaced by the server value)

If your problems occur, reset the tables within the `/Admin` either on the insecure website or logged in as Admin (`admin` / `admin`).

## How We Patched it

This vulnerability was difficult to exploit. Most of the javascript xml parser available have removed the parser ability to expand unknown external entities which prevents the vulnerability. In the insecure portion of our website we artificially expand the external entities to demonstrate the vulnerability on top of using a 3rd party xml parser. In the secure portion of the website we just use the 3rd party parser independently.
