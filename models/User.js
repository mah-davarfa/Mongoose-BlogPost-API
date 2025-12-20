const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name:{type:String, required:true, trim:true,  minlength:2, match:[/^[^<>&]+$/,'name cannot contain <, >, or &']},
        email:{type:String, required:true, trim:true, unique:true, match:[/.+\@.+\..+/,'invalid email format']},
        role:{type:String, enum: ["admin", "author", "reader"], default:"author" }
    },
    {timestamps: true}
    )

    module.exports= mongoose.model('user',userSchema)