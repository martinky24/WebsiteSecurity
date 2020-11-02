# [Injection](https://owasp.org/www-project-top-ten/2017/A1_2017-Injection)

Injection is when hostile data/commands are sent to an interpreter as part of a command/query.

## Our Implementation

In our app, we demonstrate a case of injection by not properly parameterizing the "transfers" portion of our site. In both the insecure and secure versions of our website, a destination account number and amount is prompted from the user. However, in the insecure version of our website, the user can enter any string into the account number input, and the server does not perform checks to ensure that the account number is numerical. This allows the user to manipulate the transfer query directly.

## Steps to Exploit

1. From the insecure portion of our site, login as any non-admin user (`froglover420` / `ilovefrogs`)
2. Once logged in, go to `/Transfers`
3. Enter a hostile where clause into the account number input, ie. `25 or 1=1; UPDATE financial_info set balance = 100000 where account_number = 31080649`(substitute the current user's account number as seen above the transfer form)
4. Enter a valid amount to transfer, ie. 1
5. View the anticipated change in account balance above the transfer form

If your injection irrepairably messed up the database, simply login as `Admin`/`Admin` and from the admin panel, reset the tables.

## How We Patched it

We implemented a number of changes to combat the injection. For a simple fix we changed the account number input to be of type number. More completely, we added a checks to the account/balance to ensure that they are numerical values and also checked that each query returned a desired value such as exactly one row returned on a select statement and a count of one user was found with a given account number. If any of these checks fail our queries update queries are wrapped in a transaction that we can rollback to undo malicious input. These changes are implemented on the secure portion of our site.
