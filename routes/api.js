const AuthRoutes = require("./auth")
let initAPIs = (app) => {
    app.use("/api/auth", AuthRoutes)
    
    return app
}
module.exports = initAPIs;