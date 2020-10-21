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
sudo -E pm2 start index.js
```

This command will run elevated since we are interfacing with a public port. The "-E" is used to maintain the set environment variables from earlier. 
