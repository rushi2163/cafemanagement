const express = require('express');
const connection = require('../connection');
const router = express. Router();
let ejs = require('ejs');

let pdf= require('html-pdf') ;
let path= require('path');
var uuid= require('uuid');
var auth= require('../services/authentication') ;
var fs=require('fs') ;

// it generate pdf 
router.post('/generateReport',auth.authenticateToken,(req,res,next)=>{
    let orderDetails=req.body;
    const generateUUID= uuid.v1();
    var productDetailsReport=JSON.parse(orderDetails.productDetails);
    var query = "insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy) values(?,?,?,?,?,?,?,?)"
    connection.query(query,
        [
            orderDetails.name,
            generateUUID,
            orderDetails.email,
            orderDetails.contactNumber,
            orderDetails.paymentMethod,
            orderDetails.totalAmount,
            orderDetails.productDetails,
            res.locals.email
        ],(err,result)=>{
        if(!err){
            ejs.renderFile(path.join(__dirname,"report.ejs"),{
                productDetails:productDetailsReport,
                name:orderDetails.name,
                email:orderDetails.email,
                contactNumber:orderDetails.contactNumber,
                paymentMethod:orderDetails.paymentMethod,
                totalAmount:orderDetails.totalAmount
            },(err,result)=>{
                if(err){
                    return  res.status(500).json({message:"error in ejs.render",err:err});
                }
                else{
                    pdf.create(result).toFile('./generated_pdf/'+generateUUID+".pdf",function(err, data){
                        if(err){
                            return  res.status(500).json({message:"error in pdf.create",err:err});
                        }
                        else{
                            return res.status(200).json({UUID:generateUUID});
                        }
                    })
                }
            })


        }
        else{
            return  res.status(500).json({err:err,message:"error in main query"});
        }
    })
})


//this method is used to send pdf to user using uuid 
router.post('/getPdf',auth.authenticateToken,function(req,res){
    const orderDetails = req.body;
    const pdfPath = './generated_pdf/'+orderDetails.uuid+'.pdf' ;
    if(fs.existsSync(pdfPath) ) {
        res.contentType( "application/pdf" ) ;
        fs.createReadStream(pdfPath).pipe(res) ;
    }
    else{
        
       var productDetailsReport = JSON.parse(orderDetails. productDetails );
       ejs.renderFile(path.join(__dirname,"report.ejs"),{
        productDetails:productDetailsReport,
        name:orderDetails.name,
        email:orderDetails.email,
        contactNumber:orderDetails.contactNumber,
        paymentMethod:orderDetails.paymentMethod,
        totalAmount:orderDetails.totalAmount
    },(err,result)=>{
        if(err){
            return  res.status(500).json({message:"error in ejs.render",err:err});
        }
        else{
            pdf.create(result).toFile('./generated_pdf/'+orderDetails.uuid+".pdf",function(err, data){
                if(err){
                    return  res.status(500).json({message:"error in pdf.create",err:err});
                }
                else{
                    res.contentType( "application/pdf" ) ;
                    fs.createReadStream(pdfPath).pipe(res) ;
                }
            })
        }
    })
    }
    
})

module.exports=router;
