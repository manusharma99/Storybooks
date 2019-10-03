const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const {ensureAuthenticated,ensureGuest}= require('../helpers/auth');


// stories index
router.get('/',(req,res)=>{
    Story.find({status:'public'})
    .populate('user')
    .then(stories => {
        return res.render('stories/index',{stories:stories});
    });
});

//add stories
router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('stories/add');
    });


// process stories post request
router.post('/',(req,res)=>{
let allowComments;
if(req.body.allowComments){
    allowComments=true;
}else{
    allowComments=false;
}

const newStory={
    title:req.body.title,
    body:req.body.body,
    status:req.body.status,
    allowComments:allowComments,
    user: req.user.id
}

new Story(newStory)
.save()
.catch(error=>{throw error})
.then(Story=> {
    return res.send('sent');
});
});

module.exports=router;