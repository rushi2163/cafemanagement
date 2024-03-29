
const express= require( 'express');

const connection= require('./connection');
const userRoute=require('./routs/user');
const categoryRoute=require('./routs/category');
const productRoute=require('./routs/product');
const billRoute=require('./routs/bill');
const dashboardRoute= require('./routs/dashboard')

var cors= require( 'cors')
const app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/user',userRoute);//when you go to user path it will call userRoute file
app.use('/category',categoryRoute)
app.use('/product',productRoute);
app.use('/bill',billRoute)
app.use('/dashboard',dashboardRoute)


module. exports= app;