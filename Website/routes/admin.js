var express = require('express');
var router = express.Router();
const queries = require("../data/queries");
const rMethods = require('./../routeMethods');
const xmlparser = require("express-xml-bodyparser");
const fs = require('fs');

router.get('/admin', async function (req, res, next) {
    content = [];
    content.username = req.session.uname;

    if ((req.session.secure) && (req.session.uname != "admin")) {
        return res.redirect('/home');
    }
    const result = await queries.getAllFinancialInfo();
    content.data = result.rows;
    Object.assign(content, req.savedContext);
    res.render('pages/admin', content);
});

async function processUpload(req,res,next){
    // Recieves account values from xml and creates account
    // Returns http status to determine page reload (200 or 520 reload)
    if (!req.body) {
        res.sendStatus(429);
    }
    var info = req.body.account;
    var username = info.username;
    var password = info.password;

    var personal = info.personal;

    if(!req.session.secure){
        // Expands external entities for vulnerability since modern parsing libraries do not
        for(const [key,value] of Object.entries(personal)){
            // Find all entities within the xml
            let matches = value.matchAll(/(&.*?;)/g);
            for(const match of matches){
                // console.log("indx:",match.index,"\ninput:",match[0])
                if(match[0].length > 2){
                    // Replace all entities with dummy value
                    personal[key] =  personal[key].replace(match[0],`Server Value for entity '${match[0]}'`);
                }
            }
        }
    }
    var first = personal.first_name;
    var last = personal.last_name;
    var bday = personal.date_of_birth;
    var email = personal.email;
    
    await queries.checkValidUsername(username).then(async (result) => {

        if (result.rows.length > 0 && result.rows[0].exists) {
            await rMethods.saveSessionContext({
                warning: "Username already exists"
            }, req);
            throw "Username already exists"
        }
        await queries.createUser(username, password).then(userRes => {
            uid = userRes.rows[0].user_id;
            queries.createUserInfo(first, last, bday, email, uid).then(async (userInfoRes) => {
                await rMethods.saveSessionContext({
                    success: userInfoRes.Success
                }, req);
                return res.sendStatus(200);
            }).catch(async err => {
                console.log('createUserInfo(...) error occurred: ', err);
                await rMethods.saveSessionContext({
                    error: "Error occurred during account creation"
                }, req);
                return res.sendStatus(520);
            });
        }).catch(async (err) => {
            console.log('createUser(...) error occurred: ', err);
            await rMethods.saveSessionContext({
                error: "Error occurred during account creation"
            }, req);
            return res.sendStatus(520);
        });

    }).catch(async (err) => {
        console.log('checkValidUsername(...) error occurred: ', err);
        await rMethods.saveSessionContext({
            error: "Error occurred during account creation"
        }, req);
        return res.sendStatus(520);
    });
}

router.post('/uploadAccount', xmlparser({trim: false, explicitArray: false,strict:false,async:true}), 
processUpload);
router.get('/logs', async function(req, res, next) {
    if ((req.session.secure) && (req.session.uname != "admin")) {
        return res.redirect('/home');
    }
    res.sendFile('logs/access.log', { root: '.' })
});

router.post('/resetlogs', async function(req, res, next) {
    if ((req.session.secure) && (req.session.uname != "admin")) {
        return res.redirect('/home');
    }
    var options = { flag : 'w' };
    fs.writeFile('logs/access.log', "", options, function(err) {
        if (err) throw err;
        console.log('file saved');
    });
    res.redirect("/admin");
});

module.exports = router;