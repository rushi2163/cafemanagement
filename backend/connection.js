const mysql= require('mysql') ;
require('dotenv').config() ;
var connection = mysql.createConnection({
    port:process.env.DB_PORT,
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
});
//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your password in quots';
//we have to alter user to connect with my sql using node
connection.connect(
    (err)=>{
        if(!err){
            console.log("connected sucessfully");
        }
        else{
            console.log(err);
        }
    }
);

module.exports=connection;