const express = require('express') ;
const connection = require('../connection') ;
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require( '../services/checkRole');


// to add product of specific category
router.post('/add',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let product=req.body;
    query="insert into product (name,categoryId,description,price,status) values(?,?,?,?,'true')";
    connection.query(query,[product.name,product.categoryId,product.description,product.price],(err,result)=>{
        if(!err){
            return res.status(200).json({message:"product Added Successfully"});
        }
        else{
            return  res.status(500).json({message:err});
        }
    })
})
// to get all product by joining product and category table
router.get('/get',auth.authenticateToken,(req,res,next)=>{
    let category=req.body;
    query='select p.id,p.name,p.description,p.price,p.status,c.id as categoryId,c.name as categoryName from product as p inner join category as c where p.categoryId=c.id';
    
    connection.query(query,(err,result)=>{
        if(!err){
            return res.status(200).json(result);
        }
        else{
            return  res.status(500).json({message:err});
        }
    })
})



// to get product of specific category
router.get('/getByCategory/:id',auth.authenticateToken,(req,res,next)=>{
    const id =req.params.id;
    query ="select id,name from product where categoryId=? and status= 'true'";    
    connection.query(query,[id],(err,result)=>{
        if(!err){
            return res.status(200).json(result);
        }
        else{
            return  res.status(500).json({message:err});
        }
    })
})

// to get a singlt product 
router.get('/getByID/:id',auth.authenticateToken,(req,res,next)=>{
    const id =req.params.id;
    query ="select id,name,description,price from product where id=?";    
    connection.query(query,[id],(err,result)=>{
        if(!err){
            return res.status(200).json(result[0]);// result[0]  is used because we want to pass data in json if we remove [0] index it will pass data in array form
        }
        else{
            return  res.status(500).json({message:err});
        }
    })
})


// to update product 
router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let product=req.body;
    query='update product set name=?,categoryId=?,description=?,price=? where id=?';
    connection.query(query,[product.name,product.categoryId,product.description,product.price,product.id],(err,result)=>{
        if(!err){
            if(result.affectedRows==0){
                return res.status(404).json({message:"Product id dose not found"});
            }
            return res.status(200).json({message:"Product updated Successfully"});
        }
        else{
            return  res.status(500).json({message:err});
        }
    })
})

//to delete a specific product using its id
router.delete('/delete/:id',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    const id =req.params.id;
    query="delete from product where id=?";
    connection.query(query,[id],(err,result)=>{
        if(!err){
            if(result.affectedRows==0){
                return res.status(404).json({message:"Product id dose not found"});
            }
            return res.status(200).json({message:"product deleted Successfully"});
        }
        else{
            return  res.status(500).json({message:err});
        }
    })
})

// to update status of the product ( availablity of the product )
router.patch('/updateStatus',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let product=req.body;
    query='update product set status=? where id=?';
    connection.query(query,[product.status,product.id],(err,result)=>{
        if(!err){
            if(result.affectedRows==0){
                return res.status(404).json({message:"Product id dose not found"});
            }
            return res.status(200).json({message:"Product status updated Successfully"});
        }
        else{
            return  res.status(500).json({message:err});
        }
    })
})
module.exports=router;