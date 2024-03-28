const express = require('express');
const connection = require('../connection');
const router = express.Router();

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
        if(!err){
            if(result.length<=0|| result[0].password!=user.password){
                return res.status(401).json({message:"Incorrect username or password"});
            }
            else if(result.status==='false'){
                return res.status(401).json({message:"Wait for admin approval"});
            }
            else if(result[0].password==user.password){
                //we are generating jwt token  hear
                console.log("");

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


module.exports=router
