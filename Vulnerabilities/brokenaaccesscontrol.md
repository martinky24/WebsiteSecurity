# [Broken Access Control](https://owasp.org/www-project-top-ten/2017/A5_2017-Broken_Access_Control)

Broken Access Control is when restrictions on what different users should and should not have access to are not correctly enforced.

## Our Implementation

In our app, we demonstrate a case of broken authentication by not properly locking up the "admin tools" portion of our site. In both the insecure and secure versions of our website, only when one is logged in as the administrator do they get the "admin" item in their toolbar. However, in the insecure version of our website, any user can access to admin toolbar by simply going to `/admin` manually. This gives them access to sensitive banking information.

## Steps to Exploit

1. From the insecure portion of our site, login as any non-admin user (`froglover420` / `ilovefrogs`)
2. Once logged in, go to `/admin`
3. Note access to sensitive user banking info

## How We Patched it

This was a simple fix: ensure that the administrator must be the active user of the session for the `/admin` page to load, otherwise the user will get redirected. This is the behavior you will see in the secure version of our site.
