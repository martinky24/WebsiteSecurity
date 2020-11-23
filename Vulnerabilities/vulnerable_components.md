# [Using Components with Known Vulnerabilities](https://owasp.org/www-project-top-ten/2017/A9_2017-Using_Components_with_Known_Vulnerabilities)

It is easy to take for granted that the libraries one uses and relies on are secure, reliable, and well maintained. Even libraries whose authors have the best intentions, however, can have vulnerabilities slip in. Responsible library maintainers will normally quickly put out a patch, but if the end user relying on the package doesn't update their version to the new on including the patch, the will be stuck with the vulnerability. 

There are many places where vulnerable components can exist: the OS, the web/application server, the DBMS, libraries, etc, so it can sometimes be overwhelming to diligently track and manage everything individually. Luckily there are tools such as [Retire](https://retirejs.github.io/retire.js/) which can help automate the proces of checking dependencies for issues. Retire's database of issues helped us research and find a vulnerability to implement in our site.

## Our Implementation

We implemented [CVE-2019-8331](https://github.com/advisories/GHSA-9v3m-8fp8-mj99), a vulnerability recently found in Bootstrap, a library we were already using for our site. We configured our site such that the insecure version of our site called Bootstrap 4.0.0 (which was vulnerable to the exploit) while our secure site used the most up-to-date available version of Bootstrap (4.3.1). 

The vulnerablity present in Bootstrap 4.0.0 parses and executes scripts that are injected into the `data-template` attribute of the tooltip and popover plugins, which enables cross-site scripting. The 4.3.1 version has patched this. 

## Steps to Exploit

1. Login as any user
2. Toggle the security mode to insecure.
3. Hover over the "Logged in" button in the top left. Note the alert, this is because the tooltip executed arbitrary javascript (that we added) from its `data-template` attribute when hovered over.
4. Toggle to the secure version of the site
5. Hover over the "Logged In" button once more, note no alert. The only thing that changed between these two pages (which affects this behavior) is the version of Bootstrap the page is being rendered with. The code generating the tooltip is identical
