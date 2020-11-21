#!/bin/bash
# To run under the current shell -> ". /path/to/setenv.sh"

# Admin web app use
export DBADMINUSER="adminuser"
export DBADMINPASS="admin"

# Generic web app use
export DBUSER="basicuser"
export DBPASS="basic"

# Super admin - to modify/create tables in pgadmin
export DBCOREUSER="coreuser"
export DBCOREPASS="corepass"

# ports 
export HTTPPORT=8080
export HTTPSPORT=8443

# key files
export PRIVKEY="./sslcerts/test_key.key"
export CERT="./sslcerts/test_key.crt"
