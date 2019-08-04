const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({
title:{
    type: String,
    required:true
},
body:{
    type: String,
    required: true
},
status:{
    type: String,
    default:'public' 
},
allowComments:{
    type: Boolean,
    default: true
},
comments:[{
    commentBody:{
        type: String,
        required: true
    },
    commentDate:{
        type:String,
        default: Date.now
    },
    commentUser:{
        type:Schema.Types.ObjectId,
        ref:'users'
    }
}],
User:{
    type:Schema.Types.ObjectId,
    ref:'users'
},
Date:{
    type: Date,
    default: Date.now
}
});

mongoose.model('stories',StorySchema,'stories');