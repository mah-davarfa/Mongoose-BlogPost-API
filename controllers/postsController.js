const mongoose = require('mongoose');
const Post = require ("../models/Post");
const Comments = require("../models/Comment");
//helper function for error

function errorMaker(status,message){
const err = new Error(message)
        err.status=status
        return err
}

const ifIdIsValidIdWithMongoose=  (id)=>{
    return  mongoose.isValidObjectId(id)
}

//POST/api/posts
const createPost = async (req,res,next)=>{
    try{
         const {title,content,author,published} = req.body;
        console.log("CREATE POST HIT - controller version: author mode", req.body);
   if(!title || !content|| !author) return next(errorMaker(400,'to create a post Title, content and author\'sId are required'))
   const t= String(title).trim()
   const c =String(content).trim()
   if(t.length<3) return next(errorMaker(400,'title min 3 characters'))
   if(c.length<10) return next(errorMaker(400,'content min 10 characters'))
    if (!ifIdIsValidIdWithMongoose(author)) return next(errorMaker(400,'invalid author\'s Id format'))
   let publishedValue = false;
    if(published){
        if(typeof published ==='string'){
            publishedValue = published.toLocaleLowerCase().trim() ==='true'
        }else{
            publishedValue = Boolean(published)
        }
    }
    const newPost = {
    title: t,
    content: c,
    author:  author,
    published: publishedValue,
    };
        const createdPost = await Post.create(newPost)
        if(!createdPost) return next (errorMaker(500,'failed to create new post'))
            const populatedPost = await Post.findById(createdPost._id)
        .populate('author','name email');
    res.status(201).json({
        message:'new post created',
        post:populatedPost
    })
    }catch(err){
        return next(err)
    }
}

//GET/api/posts
const getAllPosts= async (req,res, next)=>{
   try{
    const posts = await Post.find()
        .populate({
        path:'comments',
        select:'content author createdAt',
        populate:{path:'author', select:'name'}
    })
    .populate('author','name email').sort({createdAt:-1});
    if(!posts) return next (errorMaker(500,'could not retrieve posts'));

    res.status(200).json({
        posts:posts,
        count:posts.length
    })
   }catch(err){
    return next(err)
   }

}
//GET/api/posts/:id
const getPostById= async (req,res,next)=>{
    try{
            const {id}= req.params;
        if(!id) return next(errorMaker(400,'To get a post need ID'))
        if(!ifIdIsValidIdWithMongoose(id)) return next(errorMaker(400,'invalid post ID format'))
            const post = await Post.findById(id)
        //check if post exist
        if(!post) return next(errorMaker(404,'the requested post not found '))
            //populate comments and author for post
        await post
        ///regular populate to add comment to post display
        .populate({
            path:'comments',
            select:'content author createdAt',
            populate:{path:'author', select:'name'}
        })
        .populate('author','name email');
            if(!post) return next(errorMaker(404,'the requested post not found '))
         res.status(200).json({
                post
             }) 
    }catch(err){
        return next(err)
    }
}


//PUT/api/posts/:id
const updatePost= async (req,res,next)=>{

    try{
    const{id}=req.params
    if(!id) return next(errorMaker(400,'ID is required for update'))
        if(!ifIdIsValidIdWithMongoose(id)) return next(errorMaker(400,'invalid post ID format'))
            const {title,content,published}=req.body

    const newUpdate={}
        if(title)newUpdate.title = String(title).trim()
        if(content)newUpdate.content =String(content).trim()
       
        
        if(newUpdate.title && newUpdate.title.length<3) return next(errorMaker(400,'title min 3 characters'))
        if(newUpdate.content && newUpdate.content.length<10) return next(errorMaker(400,'content min 10 characters'))
                if (published !== undefined) {
                    if(typeof published === 'string'){
                      newUpdate.published= published.toLocaleLowerCase().trim()=== 'true'
                    }else{
                        newUpdate.published = Boolean(published); 
                    }
                }
         if (Object.keys(newUpdate).length === 0) {
      return next(errorMaker(400, "No valid fields provided for update"));
    }        
        //updating
                     const postUpdated = await Post.findByIdAndUpdate(id,newUpdate,{
                        new:true,
                        runValidators:true
                    }).populate("author", "name email");
    if(!postUpdated) return next(errorMaker(404,'the post does not exist to be updated'))
    res.status(200).json({
        message:"updated",
       post:postUpdated 
    })
    }catch(err){
        return next(err)
    }
}
//DELETE /api/posts/:id
const deletePost=async (req,res,next)=>{
    try{
        const {id}= req.params
        if(!id) return next(errorMaker(400,'ID is required for Delete'))
            if(!ifIdIsValidIdWithMongoose(id)) return next(errorMaker(400,'invalid post ID format'))
        const removedPost = await Post.findByIdAndDelete(id);
       
        if(!removedPost) return next(errorMaker(404,'the post does not exist to be deleted'))
             const removeCommentsForThatPost = await Comments.deleteMany({post:id})
     res.status(200).json({
        message:'post succesfully removed',
        post:removedPost
     })
    }catch(err){
        return next(err)
    }

}
module.exports={
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
}