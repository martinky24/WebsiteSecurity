# [Security Misconfiguration](https://owasp.org/www-project-top-ten/2017/A6_2017-Security_Misconfiguration)

Security Misconfiguration is when application settings, tools, or services allow for unintended access or functionality. This could be returning server error stack
traces to the client or the default configurations for a certain framework allowing all users admin-like usage.

## Our Implementation

Before our patch, the whole website ran queries using a superuser database role. We changed this to having a limited privilege admin and basic user roles.
We chose the transfer page, which was already vulnerable to sql injection, to test the vulnerability. We used this page to test if the user can execute a truncate query which is not allowed for the basic user role but is for the superuser role.

## Steps to Exploit

1. From the insecure portion of our site, login as any non-admin user (`froglover420` / `ilovefrogs`)
2. Once logged in, go to `/account`, observe personal Info (if already absent, refer to Help below)
3. Go to `/transfers`
4. Enter a hostile where clause into the account number input, ie. `25 or 1=1; TRUNCATE personal_info`
5. Enter a valid amount to transfer, ie. 1
6. Go to `/account`, observe lack of personal Info

## Help

If any problems occur, reset the tables within the `/Admin` either on the insecure website or logged in as Admin (`admin` / `admin`).

## How We Patched it

We were initially running all queries under one db superuser role. This meant that anyone on the webapp could utilize any query including the creation, truncation, and deletion of tables. We moved to creating two new roles: admin user and basic user. Both of these roles can perform SELECT, UPDATE, and INSERT queries while only admin users can perform truncation. (for ease of use on the admin page) Neither of the roles have the privileges to create/delete tables or other sql functionalities. The basic user role is used on all banking application pages while the admin user is used for the table-based queries associated with the `/Admin` route.
