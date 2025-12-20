
let posts = [
  {
    id: 1,
    title: 'Hello Blog',
    content: 'This is the first post in our in-memory store.',
    author: 'System',
    authorId:1,
    published: false,
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  }
];
//helper function for error

function errorMaker(status,message){
const err = new Error(message)
        err.status=status
        return err
}


//GET/api/posts
const getAllPosts=(req,res, next)=>{
   try{
    res.status(200).json({
        posts:posts,
        count:posts.length
    })
   }catch(err){
    return next(err)
   }

}
//GET/api/posts/:id
const getPostById=(req,res,next)=>{
    const {id}= req.params;
    if(!id) return next(errorMaker(400,'To get a post need ID'))
        try{
             const post= posts.find(p=>p.id===Number((id)))
             if(!post) return next(errorMaker(404,'the requested post not found ')) 
             res.status(200).json({
                post
             })
    }
    catch(err){
        return next(err)
    }    

    
}

//POST/api/posts
const createPost = (req,res,next)=>{
    try{
         const {title,content,author,authorId,published} = req.body;

   if(!title || !content) return next(errorMaker(400,'to create a post Title and content are required'))
   const t= String(title).trim()
   const c =String(content).trim()
   if(t.length<3) return next(errorMaker(400,'title min 3 characters'))
   if(c.length<10) return next(errorMaker(400,'content min 10 characters'))

   const latestId =posts.length>0 ? 
   posts.reduce((acc,post)=>{return post.id>acc? post.id : acc},0)
   : 0;
    const newPost = {
    id: latestId+1,
    title: t,
    content: c,
    author: (typeof author === 'string' && author.trim()) ? author.trim() : 'Anonymous',
    authorId: (authorId !== undefined ? Number(authorId) : undefined),
    published: Boolean(published) || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    }
        posts.push(newPost)
    
    res.status(201).json({
        message:'new post created',
        post:newPost
    })
    }catch(err){
        return next(err)
    }
}
//PUT/api/posts/:id
const updatePost=(req,res,next)=>{

    try{
    const{id}=req.params
    

    if(!id) return next(errorMaker(400,'ID is required for update'))

     const updatePostIndex = posts.findIndex(post=> post.id===Number(id))
        if(updatePostIndex===-1) return next(errorMaker(404,'the post does not exist to be updated'))

            const {title,content,author,authorId,published}=req.body

    const newUpdate={}
        if(title)newUpdate.title = String(title).trim()
        if(content)newUpdate.content =String(content).trim()
        if(author)newUpdate.author=String(author)
        if(authorId)newUpdate.authorId= Number(authorId)
            
            newUpdate.updatedAt=new Date().toISOString()
        if(newUpdate.title && newUpdate.title.length<3) return next(errorMaker(400,'title min 3 characters'))
        if(newUpdate.content && newUpdate.content.length<10) return next(errorMaker(400,'content min 10 characters'))
                if (published !== undefined) {
                    if(typeof published === 'string'){
                      newUpdate.published= published.toLocaleLowerCase().trim()=== 'true'
                    }else{
                        newUpdate.published = Boolean(published); 
                    }
                }
        //updating
        posts[updatePostIndex]={...posts[updatePostIndex],
        ...newUpdate
     }
    
    res.status(200).json({
        message:"updated",
       post:posts[updatePostIndex] 
    })
    }catch(err){
        return next(err)
    }
}
//DELETE /api/posts/:id
const deletePost=(req,res,next)=>{
    try{
        const {id}= req.params
        if(!id) return next(errorMaker(400,'ID is required for Delete'))

        const PostIndex = posts.findIndex(post=> post.id===Number(id))
        if(PostIndex=== -1) return next(errorMaker(404,'the post does not exist to be removed'))

     const [removedPost] = posts.splice(PostIndex,1)
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