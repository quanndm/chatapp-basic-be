const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require("../models/user")
const jwtHelper = require("../utils/jwt.helper");
const debug = console.log.bind(console);



const register = async (req, res)=>{
    try {
        const { first_name, last_name, email, password, user_name } = req.body;
        if (!(email && password && first_name && last_name && user_name)) {
            return res.status(400).json({"message": "All input fields are required"});
        }
        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(409).json({"message":"User Already Exist. Please Login"});
        }
        const salt = await bcrypt.genSalt(saltRounds);
        const encryptedPassword = await bcrypt.hash(password, salt);
        // Create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            user_name:user_name,
            password: encryptedPassword,
        });
        await user.save();

        return res.status(201).json({"message":"registered successfully"});
    } catch (error) {
        debug(error)
        return res.status(500).json({"message": error.message})
    }
}
const login = async (req, res) =>{
    const accessTokenLife = "30m"
    const accessTokenSecret = process.env.ACCESS_TOKEN_PRIVATE_KEY
    const refreshTokenLife = "15d"
    const refreshTokenSecret = process.env.REFRESH_TOKEN_PRIVATE_KEY 
    const {email, password} = req.body;
    const user = await User.findOne({email: email})
    if(!user)
        return res.status(401).json({"message":"User not found!"});
    const validPassword = await bcrypt.compare(password, user.password);
    if(validPassword){

        const accessToken = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife);
        const refreshToken = await jwtHelper.generateToken(user, refreshTokenSecret, refreshTokenLife);
        //tokenList[refreshToken] = {accessToken, refreshToken};
        // res.cookie("X-access-token", accessToken, {
        //     httpOnly: true
        // })
        // res.cookie("X-refresh-token", refreshToken, {
        //     httpOnly: true
        // })
         return res.status(200).json({accessToken, refreshToken});
        //return res.status(200).json({"message":"login successful"});
    }else{
        return res.status(400).json({ error: "Invalid Password" });
    }

}
const RefreshToken = async (req, res) => {
    const accessTokenLife = "30m"
    const accessTokenSecret = process.env.ACCESS_TOKEN_PRIVATE_KEY
    const refreshTokenSecret = process.env.REFRESH_TOKEN_PRIVATE_KEY 
     const refreshTokenFromClient = req.body.refreshToken;
    //const refreshTokenFromClient = req.cookies["x-refresh-token"]
    if(refreshTokenFromClient ){
        try {
            const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);
            const userDecode = decoded.data;
            const accessToken = await jwtHelper.generateToken(userDecode, accessTokenSecret, accessTokenLife);
            // res.cookie("x-access-token", accessToken, {
            //     httpOnly: true
            // })
            // res.cookie("x-refresh-token", req.cookies['x-refresh-token'], {
            //     httpOnly: true
            // })
            // return res.status(200).json({"message": "ok"});
            return res.status(200).json({accessToken});
        } catch (error) {
            debug(error);
            res.status(403).json({
                message: 'Invalid refresh token.',
            });
        }
    }
}
module.exports = {
    register,
    login,
    RefreshToken
}