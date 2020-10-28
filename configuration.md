## Web Security Project Configuration
### Server Configuration
**Server IP**: 18.217.120.194

The server is running Ubuntu Server 20.04. The following firewall rules are in place to allow accesss:
- Port 22 allow in/out (SSH)
- Port 80 allow in/out (HTTP)
- Port 443 allow in/out (HTTPS) 

AWS uses security keys to access the server over ssh. This key must be used to connect either on the command line or on in your .ssh/config file.

```bash
ssh -i path/to/key.pem ubuntu@18.217.120.194
```

OR, in your config:
```bash
Host ec2 
    HostName 18.217.120.194
    User ubuntu
    IdentityFile /path/to/key.pem
```

### Application Configuration
The default port is set at 54545 in development. Set the PORT environment variable to 80 in order to allow access to the application externally:

```bash
export PORT=80
```

The application process is managed using PM2, this allows automatic application restarts on changes. To run the applicaiton:

```bash
sudo PORT=80 pm2 start app.js
```

This command will run elevated since we are interfacing with a public port. Any environment variables need to passed to the sudo command or used in a config file. Running in the current environment "sudo -E" will spawn 2 PM2 processes that will conflict with each other and not hint at any issue. The result will be an hour of wasted time.


### Database Configuration
Database is hosted on AWS RDS, use the following to connect to postgres instance from psql:

```bash
psql -h team-web-security.cni5jxwbesmd.us-west-1.rds.amazonaws.com -p 5422 -U coreuser -W -d banking
```

The application uses environment variables to store the database username and password, set the following:
```bash
export $DBUSER=user
export $DBPASS=password
```
