const express=require('express');
const app=express();
const productos=require('./api/routes/products');

app.use('/products',productos);

module.exports=app;
