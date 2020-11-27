# [Insecure Deserialization](https://owasp.org/www-project-top-ten/2017/A8_2017-Insecure_Deserialization)

Insecure deserialization occurs when data sent to a server is deserialized and improperly verified, allowing execution of code that was not intended. This is a difficult vulnerability to exploit depending on the platform and how the app operates. For example, a web application with a Java backend could communicate with the frontend using Java objects that get serialized and deserialized between requests to maintain an application state. An attacker could create a custom object, encode it, then send it to the server, resulting in that code being executed on the server.

## Our Implementation

Our application did not have a need for this type of serialization/deserialization. In Node JS, the default serialization is using the javascript functions ```JSON.parse()``` and ```JSON.stringify()``` to manage javascript objects. These functions do not allow the ability to include executable code within the objects, such as functions. The npm package ```node-serialize``` does allow this ability, where we could send JS functions within JSON. By using javascript's Immediately-Invoked Function Expressions (IIFEs), we can execute the following code as it is deserialized. The two parentheses after the function definition indicate an IIFE.

```json
{"rce":"function (){
        require('child_process').exec('. ./exploit.sh', 
        function(error, stdout, stderr) { 
            console.log(stdout) 
        });
    }()"
}
```

This function could run anything we want to on the target server. In our case, we are simply going to run a script that already exists on the server that will append the current time to a file exploit.txt. We can see the time the exploit was ran by navigating to ```/exploit```. Because you could gain remote shell access to this server using this vulnerability, we validate the input to only allow execution of the above payload (don't want someone running up our AWS bills).

## Steps to Exploit

1. Toggle the Security Mode to "insecure".
2. Log in as the ```froglover420``` user.
3. On the bottom of any page, click on the "Feedback" link.
4. In the form, enter: ```{"rce":"_$$ND_FUNC$$_function (){require('child_process').exec('. ./exploit.sh', function(error, stdout, stderr) { console.log(stdout) });}()"}``` and submit.
5. The shell script ```./exploit.sh``` will run on the server and create or delete a file called ```exploit.txt```.
6. Navigate to ```/exploit``` to view the file or the 404 message.
7. Repeat steps 3 to 6 to verify the change.

## How We Patched it

Since we had no use for deserialization in this manner, we had to add the vulnerability. In the case this feature was needed, or you were using a framework that included deserialization to handle application state, it is best to keep your application up to date on security patches. The Java deserialization issues were patched once they were discovered, and the ```node-serialize``` package is marked as vulnerable. Beyond this, ensure proper validation of any user input. Do not trust any user input.
