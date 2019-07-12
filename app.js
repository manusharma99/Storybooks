const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.get('/',(req,res)=>{
    res.send('it works');
});
const port = 5000;
app.listen(5000,()=>{
    console.log('Listening to port '+port);
});