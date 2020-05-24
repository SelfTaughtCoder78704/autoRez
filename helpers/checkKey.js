module.exports = {
    
    ensureAuthenticated: function(req, res, next){
        let isAuth = process.env.OUR_API
        let consideredForAuth = req.query.id
        if (consideredForAuth &&  consideredForAuth === isAuth){
            return next()
        }else{
            res.send("NO GO")
        }
    }
}