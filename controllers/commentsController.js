const mongoose = require('mongoose')
const Comments = require('../models/Comment')
const Posts =require("../models/Post")
const Users = require('../models/User')



function makeError (status,message){
    const err= new Error(message)
    err.status=status;
    return err
}

const isIdValidWithMongoose =(id)=>{
    return mongoose.isValidObjectId(id)
}

//GET / api/ comments/:userId    getting  All comments for a user 
const getAllUserComments = async (req,res,next)=>{
    try{
        const {id}= req.params;
        if(!id) return next (makeError (400,'UserId is required'))
        if(!isIdValidWithMongoose(id)) return next (makeError (400,'UserId is not valid Mongoose id'))
         const isUserExist = await Users.findById (id);
            if(!isUserExist) return next (makeError (404,'User with this id not exist!!'))
       
                const commentsForUser = await Comments.find({author:id})
                            .populate('author','name')
                            .populate('post','title content')
    res.status(200).json({
        comments:commentsForUser,
        count:commentsForUser.length
    })
    }catch(err){
        next(err)
    }
}
//create comment for a post
//POST /api/comments/:postId
const createComment = async (req, res, next)=>{
    try{
        const {postId}= req.params;
        if(!postId) return next(makeError(400,'PostId is required'))
        if(!isIdValidWithMongoose(postId)) return next (makeError (400,'PostId is not valid Mongoose id'))
         const isPostExist = await Posts.findById (postId);
            if(!isPostExist) return next (makeError (404,'Post with this id not exist to comment on it!!')) 

            const {comment,authorId} =req.body;
            if(!comment || !authorId) return next (makeError(400,'comment & authorId are required'))
            if(comment.trim().length <3 || comment.trim().length >1000)
            return next (makeError(400,'comment length must be between 3 and 1000 characters'))
            
            if(!isIdValidWithMongoose(authorId)) return next (makeError (400,'authorId is not valid Mongoose id'))
            const isAuthorExist = await Users.findById (authorId);
            if(!isAuthorExist) return next (makeError (404,'User with this authorId not exist!!'))
                //create comment with regullar populate (not virtual populate)
            let createdComment =await Comments.create({
                content:comment,
                author:authorId,
                post:postId
            })

            //add comment to the post
            await Posts.findByIdAndUpdate(postId,{
                $push:{comments:createdComment._id}
            })
            // populate post and comment for display
            createdComment = await createdComment
            .populate('author','name ')
            .populate('post','title content')             


            res.status (201).json({
                message:'Comment created successfully',
                comment:createdComment
            })
        }catch(err){
    next(err)
}
}
module.exports={
    getAllUserComments,
    createComment
}