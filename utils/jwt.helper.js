const jwt = require("jsonwebtoken");
const generateToken = async (user,secretSignature, tokenLife)=>{

    const userData = {
        _id: user._id,
        name: user.last_name + " " + user.first_name,
        username: user.user_name,
        email: user.email,
    }
    const sign = await jwt.sign(
        {data: userData},
        secretSignature,
        {
            algorithm: "HS256",
            expiresIn: tokenLife,
        }
    )
    return sign
};
const verifyToken = async (token, secretKey) =>{
    const result = await jwt.verify(token, secretKey);
    return result
}
module.exports = {
    generateToken,
    verifyToken,
  };