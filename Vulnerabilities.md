# Password Cracking

## Unhashed passwords
##### Implementation Difficulty: Trivial

**Notes:** Website sends and stores passwords to their database in plaintext.

**Implementation needs:** Create account page, database table for unhashed passwords

**How to hack:** Once someone gets database access it's gg, all passwords are known

**Resources:**

## Home-baked , low level hashing for passwords
##### Implementation Difficulty: Easy

**Notes:** Website hashes passwords using an insecure or outdated method which is computationally easy to break

**Implementation needs:** Create account page, weak hashing algorithm, database table for poorly hashed passwords

**How to hack:** Once someone gets database access, there are easy to access programs which can crack weakly hashed passwords in seconds (https://www.youtube.com/watch?v=7U-RbOKanYs demonstrates this)

**Resources:**

 - https://www.youtube.com/watch?v=7U-RbOKanYs

## Unsalted password
##### Implementation Difficulty: Easy

**Notes:** Use cryptographically secured hashing algorithm perhaps, but don't salt it

**Implementation needs:** Create account page, hash passwords without salt, database table for unsalted hashed passwords

**How to hack:** See resource below, in short this gives an attacker easier odds when two people use identical passwords

**Resources:**

 - https://auth0.com/blog/adding-salt-to-hashing-a-better-way-to-store-passwords/


# Infrastructure Issues

## HTTP instead of HTTPS
##### Implementation Difficulty: Unsure

**Notes:** HTTP sends much data in plaintext allowing for man in the middle attacks, eavesdropping, etc...

**Implementation needs:** Unsure

**How to hack:**

**Resources:**

 - https://www.cloudflare.com/learning/ssl/why-is-http-not-secure/
 - https://www.quora.com/What-are-the-security-vulnerabilities-in-HTTP


## Using component with known vulnerability
##### Implementation Difficulty: Unsure

**Notes:** A library with a known and documented vulnerability might be ripe for attack

**Implementation needs:** Find old version of a library with known issues, use it in our code

**How to hack:** Use the known hacks to break library in some manner

**Resources:**

 - https://owasp.org/www-project-top-ten/2017/A9_2017-Using_Components_with_Known_Vulnerabilities

##  Failure to restrict URL access
##### Implementation Difficulty: Trivial

**Notes:** Website stores sensitive data in unlinked pages, attacker finds these pages

**Implementation needs:** Store sensitive data in unlinked pages

**How to hack:** An attacker can guess the page URLs (even though we don't make them visible) to the sensitive data

**Resources:**
 - https://www.montana.edu/uit/security/web/failure-to-restrict-url-access.html
 - https://www.veracode.com/security/failure-restrict-url-access


##  System Exposure
##### Implementation Difficulty: Easy

**Notes:** Exposed admin console/directory traversal in some manner

**Implementation needs:** Create backend tools/data that we do not properly secure

**How to hack:** Attacker finds these admin tools, takes advantage of them in malicous ways

**Resources:**


# Malicious User Issues

##  SQL Injections
##### Implementation Difficulty: Mostly easy, probably

**Notes:** Attacker enters text interpretable by database into website with intention of corrupting database content

**Implementation needs:** Weakly implemented form which perhaps just combines strings and sends query to database

**How to hack:** Once someone gets database access it's gg, all passwords are known

**Resources:**

 - https://www.cloudflare.com/learning/ssl/why-is-http-not-secure/
 - https://www.quora.com/What-are-the-security-vulnerabilities-in-HTTP


##  Cross Site Scripting
##### Implementation Difficulty: Unsure

**Notes:** Cross Site Scripting attacks enable attackers to inject client-side scripts into web pages viewed by other users.

**Implementation needs:**

**How to hack:**

**Resources:**
 - https://en.wikipedia.org/wiki/Cross-site_scripting
 - https://owasp.org/www-community/attacks/xss/


## Malicious file uploading
##### Implementation Difficulty: Easy-ish

**Notes:** Website has field to upload a file which is processed in the backend in some manner, user uploads a file which can exploit a vulnerability in that processing causing issues

**Implementation needs:** Simple website file uploader, backend code which processes this file without much validation

**How to hack:** Upload malicious file to site

**Resources:**
 - https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload
