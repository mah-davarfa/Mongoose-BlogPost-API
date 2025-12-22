const mongoose = require('mongoose')
const sanitizeHtml= require('sanitize-html')

const postSchema = new mongoose.Schema(
    {
        title:{type:String, required:true, trim:true ,minlength:3},
        content:{
            type:String,
            required:true,
            trim:true,
            minlength:10,
            maxlength:2000,

            set:(value)=>
                sanitizeHtml(value,{
                allowedTags:[],
                allowedAttributes:{},
            })
        },
        author:{
            type:mongoose.Schema.Types.ObjectId ,
            ref:'User',
             required:true
            },
        published: {
            type: Boolean,
            default: false,
            },
        
    },
    {timestamps:true}
)
module.exports=mongoose.model('Post',postSchema)