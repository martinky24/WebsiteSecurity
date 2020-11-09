# [Cross Site Scripting (XSS)](https://owasp.org/www-project-top-ten/2017/A7_2017-Cross-Site_Scripting_(XSS))

Cross Site Scripting is a vulnerability that allows untrusted data to manipulate a web page through improper escaping and validation, resulting in malicious script execution. Usually this data can be injected into a page through input tags in html or in query parameters of a link. XSS is the second most common vulnerability on the OWASP Top Ten.

## Our Implementation
There are three main categories of XSS: reflected XSS, stored XSS, and DOM XSS. We will focus on stored XSS, as it can be a critical security issue that can effect many users. Stored XSS occurs when an application stores unsanitized user input, which is then embedded directly into a web page when the data is requested. This data generally includes a ```<script>``` tag, which will allow the attacker to run any arbitrary code. In our application, we will be creating a new user and inject a script into the users username. This script will be configured to steal the cookie of anyone who visits a page where this username is visible. An actual hacker would configure this script to send the cookie to a controlled web server to store it and use it later on. In our example, we will just show that this code is executed by alerting the cookie of the admin user in the window in a separate session.

## Steps to Exploit
1. Toggle the security mode to insecure.
2. Create a new user with the username "```test123 <script>alert(document.cookie)</script>```". You do not need to log in after creating the user.
3. Open up a different browser or incognito tab and navigate to the application. Toggle the security mode to insecure.
4. In the new browsing session, log in as admin.
5. Navigate to the admin panel, and a alert should display, showing you your session cookie.
6. This cookie would be sent to an attacker, where they could then hijack the admin session.

## How We Patched It
Patching this vulnerability can be done in a few different ways. When the session cookie is created on the server, we can set the ```httpOnly``` attribute to true, telling the browser that the cookie is not accessible via javascript. This prevents the cookie from being stolen, but still leaves the XSS vulnerability open. Sanitizing the incoming data and encoding any embedded html data will prevent a majority of XSS attacks. As a first line of defense, the user input should be scrubbed for any html elements that could be used to inject malicious code. There are various libraries that can ensure a higher degree of security in this realm, or we could write our own validations. On the html generation side, XSS can be mitigated by using know templating engines, we are using EJS. When generating the html from user data, we can encode it using ```<%= %>```, instead of directly generating using ```<%- %>```. This is essentially built in to EJS and requires no further configuration. Any encoded script tags will simply display the script code and not execute.