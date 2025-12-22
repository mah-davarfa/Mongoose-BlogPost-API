const mongoose= require('mongoose')
const sanitizeHtml= require('sanitize-html')

const commentSchema = new mongoose.Schema(
    {
        content:{
            type:String,
            minlength:3,
            maxlength:1000,
            trim:true,
            required:true,
            set:(value)=>
                sanitizeHtml(value,{
                allowedTags:[],
                allowedAttributes:{}
            })
        },
        author:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
        post:{type:mongoose.Schema.Types.ObjectId, ref:"Post", required:true}
    },
    {timestamps:true}

)
module.exports=mongoose.model('Comment',commentSchema)