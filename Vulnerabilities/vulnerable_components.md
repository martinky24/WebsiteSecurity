# [Using Components with Known Vulnerabilities](https://owasp.org/www-project-top-ten/2017/A9_2017-Using_Components_with_Known_Vulnerabilities)

It is easy to take for granted that the libraries one uses and relies on are secure, reliable, and well maintained. Even libraries whose authors have the best intentions, however, can have vulnerabilities slip in. Responsible library maintainers will normally quickly put out a patch, but if the end user relying on the package doesn't update their version to the new on including the patch, the will be stuck with the vulnerability. 

## Our Implementation

There are many places where vulnerable components can exist, the OS, the web/application server, the DBMS, libraries, etc. We found a vulnerability in a recent version of Bootstrap, a library we were already using, and configured our site so that the insecure version called an earlier, vulnerable version of Bootstrap (4.0.0) while our secure site used the most up-to-date available version of Bootstrap (4.3.1). The vulnerability in question is [CVE-2019-8331](https://github.com/advisories/GHSA-9v3m-8fp8-mj99). We then implemented a simple mechanism to trigger the vulnerability in the earlier version to demonstrate the weakness and also to verify the fix.

## Steps to Exploit

1. Login as any user
2. Toggle the security mode to insecure.
3. Hover over the "Logged in" button in the top left. Note the alert, this is because the tooltip executed arbitrary javascript (that we added) in one of its attributes when hovered over.
4. Toggle to the secure version of the site
5. Hover over the "Logged In" button once more, note no alert. The only thing that changed between these two pages (which affects this behavior) is the version of Bootstrap the page is being rendered with. The code generating the tooltip is identical

## How We Patched It

Patching this vulnerability was as simple as ensuring we had the latest version of Bootstrap installed. This is trivial, but especially on larger web apps it can be difficult to manage all packages, especially when upgrading to newer versions might introduce regressions against what might be an already stable web app.