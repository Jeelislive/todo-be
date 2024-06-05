const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    //grab token form cookie
    console.log(req.cookies);
    const { token } = req.cookies
    
    //if no token , stop there  
    if (!token) {
        res.status(403).send('plz login first')
    }

    //decode that token and get id
    try {
        const decode = jwt.verify(token, process.env.jwtsecret)
        console.log(decode);
        req.user = decode
    } catch (error) {
        console.log(error);
        res.status(401).send("invalid token")
    }

    return next();
}

module.exports = authMiddleware;