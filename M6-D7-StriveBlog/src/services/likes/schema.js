import mongoose from 'mongoose'
const { Schema, model } = mongoose

const LikesSchema = new Schema({
    isliked:{type:Boolean, required:true},
    authors:[{type:Schema.Types.ObjectId, ref:"Authors"}]
}, {timestamps:true})

export default model("Like", LikesSchema)