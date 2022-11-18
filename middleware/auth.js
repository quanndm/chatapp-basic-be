const jwtHelper = require("../utils/jwt.helper");
const schema = require("../utils/validateRequest");
const debug = console.log.bind(console);
const Joi = require('joi'); 

const isAuth = async (req, res, next) => {
    const accessTokenSecret = process.env.ACCESS_TOKEN_PRIVATE_KEY
     const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
    //const tokenFromClient = req.cookies["x-access-token"];

    if(tokenFromClient){
        try {
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            req.jwtDecoded = decoded;
            next();
        } catch (error) {
            debug("Error:", error);
            return res.status(401).json({
                message: 'Unauthorized.',
            });
        }
    }else{
        return res.status(403).send({
            message: 'No token provided.',
          });
    }
}
const isValidLoginRequest = (req, res, next) =>{
    const { error } = Joi.validate(req.body, schema.loginSchema);
    const valid = error == null; 
    if (valid) 
        next(); 
    else {
        const { details } = error;
        const message = details.map(i => i.message).join(',');

        debug("error", message);
        res.status(422).json({ error: message })
    }
}
module.exports = {
    isAuth,
    isValidLoginRequest
};