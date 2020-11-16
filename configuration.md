## Web Security Project Configuration
### Server Configuration
**Server IP**: 3.139.200.131

The server is running Ubuntu Server 20.04. The following firewall rules are in place to allow accesss:
- Port 22 allow in/out (SSH)
- Port 80 allow in/out (HTTP)
- Port 443 allow in/out (HTTPS) 

AWS uses security keys to access the server over ssh. This key must be used to connect either on the command line or on in your .ssh/config file.

```bash
ssh -i path/to/key.pem ubuntu@3.139.200.131
```

OR, in your config:
```bash
Host ec2 
    HostName 3.139.200.131
    User ubuntu
    IdentityFile /path/to/key.pem
```

### Application Configuration
Many configuration values are set in environment variables using a shell script. The following is an example of this script with the required variables.

```bash
#!/bin/bash
# To run under the current shell -> ". /path/to/setenv.sh"
# Admin web app use
export DBADMINUSER="______"
export DBADMINPASS="______"
# Generic web app use
export DBUSER="______"
export DBPASS="______"
# Super admin - to modify/create tables in pgadmin
export DBCOREUSER="______"
export DBCOREPASS="______"

# ports 
export httpPort=______
export httpsPort=______

# key files
export privkey="./sslcerts/______.key"
export cert="./sslcerts/______.crt"

```

To Run the script, ensure the file has execute permissions and you are root:
```bash
. setenv.sh
```

The application process is managed using PM2, this allows automatic application restarts on changes. To run the application:
```bash
pm2 start app.js
```

This command needs to run elevated since we are interfacing with public ports. Any environment variables need to passed to the sudo command or the pm2 command will need to be executed from root. Running in a non root environment "sudo -E" will spawn 2 PM2 processes that will conflict with each other and not hint at any issue. The result will be an hour of wasted time.

To access process logs on pm2:
```bash
# Access logs
sudo pm2 log

# Clear logs
sudo pm2 flush
```


### Database Configuration
Database is hosted on AWS RDS, use the following to connect to postgres instance from psql:

```bash
psql -h team-web-security.cni5jxwbesmd.us-west-1.rds.amazonaws.com -p 5422 -U coreuser -W -d banking
```

The application uses environment variables to store the database username and password, these are set in the ```setenv.sh``` file above.

### Application Deployment
SSH into the application server then from an elevated user:
```bash
# Pull the latest branch
cd /web_security/WebsiteSecurity/Website
git pull

# Check config and update environment variables
vim setenv.sh
. setenv.sh

# Restart PM2, update PM2 env
pm2 reload all --update-env
```
