const express = require('express');
const connection = require('../connection');
const router = express.Router();

// using JWT token
const jwt = require("jsonwebtoken");
require('dotenv').config();
// node mailer to send password to the user
const nodemailer = require('nodemailer');

router.post('/signup',(req,res)=>{
    let user= req.body;
    
    var query="select email,password,role,status from user where email=?";
    connection.query(query,[user.email],(err,result)=>{
        if(!err){
            if(result.length<=0){
                var query= "insert into user(name,contactNumber,email,password ,status,role) values(?,?,?,?,'false','user')";
                connection.query(query,[user.name,user.contactNumber,user.email,user.password],(err,responce)=>{
                    if(!err){
                        return  res.status(200).json({message:"ueser registered Sucessfully"});
                    }
                    else{
                        return res.status(500).json({ message: "Something went wrong" });
                    }
                })
            }
            else{
                return res.status(400).json({message:"user already present"});
            }
           
        }else{
            return res.status(500).json(err);
        }
    });
    
})

router.post('/login', (req,res)=>{//59.42
    const user = req.body;
    query = "select email, password, role, status from user where email=?";
    connection.query(query,[user.email],(err,result)=>{
        // console.log(result);
        if(!err){
            if(result.length<=0|| result[0].password!=user.password){
                return res.status(401).json({message:"Incorrect username or password"});
            }
            else if(result[0].status==='false'){
                // user statue is used to decide whether user can use it or not
                return res.status(401).json({message:"Wait for admin approval"});
            }
            else if(result[0].password==user.password){
                //we are generating jwt token  hear
                const response ={email:result[0].email,role:result[0].role}
                const accessToken = jwt.sign(response,process.env.ACCESS_TOKEN, {expiresIn:'1h'});
                //using login information a jwt token will be created and it have expiry
                res.status(200).json({token:accessToken}) ;

            }
            else{
                return res.status(400).json({message:"Something went wrong.plese try again"});
            }
        }
        else{
            return res.status(500).json(err)
        }
    })
})



var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})

router.post('/forgotpassword',(req,res)=>{
    let user= req.body;
    var query="select email,password from user where email=?";
    connection.query(query,[user.email],(err,result)=>{
        if(!err){
            if(result.length<=0){
                return res.status(200).json({message:"email sent Sucessfully"});
            }
            else{//1.17.14
                var mailoptions={
                    from:process.env.EMAIL,
                    to:result[0].email,
                    subject:"reset password by cafemanagement",
                    html:`<p>email:${result[0].email}</p><br><p>password:${result[0].password}</p>`
                }
                transporter.sendMail(mailoptions,function(error,info){
                    if(error){
                        console.log(error);
                    }
                    else{
                        console.log(info.response);
                    }
                })
                return res.status(200).json({message:"email sent Sucessfully"});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
})


module.exports=router
