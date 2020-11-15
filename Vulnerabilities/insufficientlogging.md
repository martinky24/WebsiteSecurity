# [Insufficient Logging](https://owasp.org/www-project-top-ten/2017/A10_2017-Insufficient_Logging%2526Monitoring)

Insufficient logging and monitoring is when an application does little to record information (both historical and in-real time) for its maintainers. Without alerts or any sort of paper trail to track down what went wrong it can be difficult to identify and rectify attacks on the system. Attackers rely on the lack of monitoring and timely response to achieve their goals without being detected.

## Our Implementation

In short, all important actions on our sites (logins/any transaction involving money) is logged to a file when it happens on the secure side, on the insecure side no such logging happens. This means that fraudulant activity can go unnoticed and untracked in the insecure portion of our site.

## Steps to Exploit

1. From the secure portion of our site, login as any non-admin user (`froglover420` / `ilovefrogs`)
2. Go to the Deposits page, and deposit any amount (remember the number)
3. Switch to the insecure version of the page (top right), and deposit another amount (remember this number as well)
4. Logout, and login as admin (`admin` / `admin`)
5. Manually navigate to /deposit-logs. 
6. Find the timestamps from when you did steps 2 and 3, and note that the secure deposit amount is logged, while the inscure is not.