# Local Development with Self Signed Certs
To create a self signed certificate, use the below bash command. Set the path and key names to what you need. This will create generic localhost key and pem files. Once these are generated, chmod them to add execute permissions, then point the applications PRIVKEY and CERT environment variables to these key files. (PRIVKEY goes to .key file, CERT goes to .crt file). 

Obviously this will create an untrusted cert, so you will need to bypass the warning page in your browser.

```bash
openssl req -x509 -out ~/certs/test_key.crt -keyout ~/certs/test_key.key \
 -newkey rsa:2048 -nodes -sha256 -subj "/CN=localhost" -extensions EXT \
  -config <(printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS.1:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```
