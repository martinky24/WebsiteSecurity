function saveSessionContext(context ,req, callback){
// js object to be used as rendering options under other routes
    req.session.context = context;
    req.session.save((err)=>{
        if(err){
            console.log("Error occurred during context saving:",err)
        }
        callback()
    });
}
function addSessionContextToRequest(req, callback){
    req.savedContext = req.session.context;
    req.session.context = {}
    req.session.save((err)=>{
        if(err){
            console.log("Error occurred during context saving:",err)
        }
        callback()
    });
}
module.exports={
    saveSessionContext,
    addSessionContextToRequest
}