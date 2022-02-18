import mongoose from 'mongoose'

const { Schema, model } = mongoose

const blogSchema = new Schema({
    category:{type:String, required:true},
    title:{type:String, required:true},
    cover:{type:String, required:true},
    readTime:{
        value:{type:Number},
        unit:{type:Number}
    },
    content:{type:String},
    comments:[
        {
            rate:{type:Number, required:true},
            commentArea:{type:String, required:true},
            commentedDate:{type:Date}
        },
    ],
    authors:[{type:Schema.Types.ObjectId, ref:"Authors"}],
    likes:[{type:Schema.Types.ObjectId, ref:"Like"}],
    
},
{
    timestamps:true
})

export default model("Blogs", blogSchema)