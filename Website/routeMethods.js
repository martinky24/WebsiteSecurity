async function saveSessionContext(context ,req){
// js object to be used as rendering options under other routes
    req.session.context = context;
    await saveSession(req);
}
async function addSessionContextToRequest(req){
    req.savedContext = req.session.context;
    req.session.context = {}
    await saveSession(req);
}
async function saveSession(req){
    return new Promise((resolve,reject)=>{
        req.session.save((err)=>{
            if(err){
                console.log("Error occurred during saving of session:",err)
                reject();
            }
            resolve();
        });
    });
}
module.exports={
    saveSessionContext,
    addSessionContextToRequest,
    saveSession
}