# [Sensitive Data Exposure](https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure)
Sensitive data exposure comes down to simply not protecting important data. Sensitive data should be encrypted and secured to prevent attackers from easily accessing the information. This is a broad categorization and the actual attacks will vary significantly. Someone could attack a weak password and brute force their way into a database, or obtain access to a database with unencrypted social security numbers, or capture http traffic and extract personal information.

## Our Implementation
We decided to implement this vulnerability by routing the user to http or https routes. Any http connection open to the world can be seen by anyone in between your computer and the destination. For a banking website, this means that important account information (account number, balance, routing numbers, username, password) will be sent over plain text to the destination.

## Steps to Exploit
Exploiting this vulnerability is as simple as hooking up WireShark or any other easily available software to your network and sniff the incoming packets. However, for our demonstration, your browser will indicate if a site has HTTPS traffic enabled and will allow you to inspect the certificate provided by the site to ensure its validity. 

1. Go to https://website-security.me/
2. Look for the lock symbol near the address bar and click on it.
3. Click on the certificate to view the issuer information. This will show who issued the certificate (in this case Let's Encrypt Authority X3), who it was issued to, and the valid dates.
4. Click "Toggle Security Mode" on the main application. 
5. You will now see that the site is insecure by looking at that same address bar location. In Chrome this says "Not Secure".

## How We Patched it
Setting up HTTPS can be a challenging process depending on what backend tools are being used. We used Let's Encrypt and Certbot to create trusted certificates to configure SSL. Ideally, we would configure SSL on a reverse proxy like NGINX to handle encryption/decryption of traffic to the application and enforce HSTS or other protocols, but we needed to be able to serve http and https for specific routes to maintain the ability to switch between secure and insecure. To accomplish this, we created the Let's Encrypt certificates and manually pointed Express to the private key and public chain. This simply allowed us more control over what traffic is secured. 
