const mongoose = require('mongoose')
const commentsModels = require('../models/Comment')
const postModels =require("../models/Post")
const usersModels = require('../models/User')



function makeError (status,message){
    const err= new Error(message)
    err.status=status;
    return err
}


//GET / api/ users/:userId/comments  All comments for a user 
const getAllUserComments = async (req,res,next)=>{
    try{
    const {userId}=req.params;
    if(!userId)return next(makeError(400,'user ID is required to load all comments '))
        mongoose.Users.find
    }catch(err){

    }

}