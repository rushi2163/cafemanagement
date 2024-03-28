
const express= require( 'express');

const connection= require('./connection');
const userRoute=require('./routs/user');
const categoryRoute=require('./routs/category');

var cors= require( 'cors')
const app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/user',userRoute);//when you go to user path it will call userRoute file
app.use('/category',categoryRoute)

module. exports= app;