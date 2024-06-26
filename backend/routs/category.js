const express = require('express') ;
const connection = require('../connection') ;
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require( '../services/checkRole');

router.post('/add',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let category=req.body;
    query='insert into category (name) values(?)';
    connection.query(query,[category.name],(err,result)=>{
        if(!err){
            return res.status(200).json({message:"Category Added Successfully"});
        }
        else{
            return  res.status(500).json({message:err});
        }
    })
})


router.get('/get',auth.authenticateToken,(req,res,next)=>{
    let category=req.body;
    query='select * from category order by name';
    connection.query(query,(err,result)=>{
        if(!err){
            return res.status(200).json(result);
        }
        else{
            return  res.status(500).json({message:err});
        }
    })
})


router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let category=req.body;
    query='update category set name=? where id=?';
    connection.query(query,[category.name,category.id],(err,result)=>{
        if(!err){
            if(result.affectedRows==0){
                return res.status(404).json({message:"Category id dose not found"});
            }
            return res.status(200).json({message:"Category updated Successfully"});
        }
        else{
            return  res.status(500).json({message:err});
        }
    })
})


module.exports=router;