import mongoose from 'mongoose'
const {Schema, model} = mongoose
import bcrypt from 'bcrypt'

const AuthorSchema = new Schema({
    first_name:{type:String},
    last_name:{type:String},
    email:{type:String, required:true},
    password:{type:String},
    role:{type:String, enum:["Admin", "User"]},
    googleId:{type:String}
   
},{timestamps:true})

AuthorSchema.pre("save", async function(next){
    const newUser = this
    const plainPassword = newUser.password
        const hashPW = await bcrypt.hash(plainPassword, 10)
        newUser.password = hashPW
        // console.log("Pasword:", hashPW);
        next()
})

AuthorSchema.methods.toJSON = function () {
    const userInfo = this
    const userObject = userInfo.toObject()
    delete userObject.password
    delete userObject.__v
  
    return userObject
  }

AuthorSchema.statics.checkCredentials = async function(email, plainPassword){
    const user = await this.findOne({email})
    if(user){
        const isMatch = await bcrypt.compare(plainPassword, user.password)
        if(isMatch){
            return user
        }else{
            return null
        }
    }else{
        return null
    }
}  


export default model("Authors", AuthorSchema)