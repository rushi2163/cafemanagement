// in this file we will incrept or decrept the access token
require('dotenv').config();
const jwt= require('jsonwebtoken');

function authenticateToken(req,res,next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]//&& is the logical AND operator in JavaScript. It returns the second operand if the first operand is truthy; otherwise, it returns the first operand.
    // console.log(authHeader);
    if (token==null){
        return res.sendStatus(401);
    }
    jwt.verify(token,process.env.ACCESS_TOKEN,(err, response)=>{
        if (err){
            return res.sendStatus(403);
        }
        res.locals= response;//it used to pass data between middleware 
        // to understand refer this video https://youtu.be/zPYmM9K8-g8?si=L2EumJsqFAWy8B2S
        next();//we can not pass data between middleware using next if we pass data using next it will passed as error to the middleware 
    })
}
    
    module.exports = { authenticateToken:authenticateToken};