import createHttpError from "http-errors";
import atob from "atob";
import AuthorModel from '../authors/schema.js'

export const userAuth = async(req,res,next)=> {
    // console.log("Auth", req.headers.authorization);
    if(req.headers.authorization){
        const base64Credentials = req.headers.authorization.split(" ")[1]
        const decodedCredentials = atob(base64Credentials) // decodedCredentials --> ali@mukhtor.com:alimukhtor99
        console.log("Decoded Credentials",decodedCredentials);
        const [email, password] = decodedCredentials.split(":")
        const user = await AuthorModel.checkCredentials(email, password)
        // if(user){
        //     req.user = user
        //     next()
        // }else{
        //     next(createHttpError(401, "Credentials are not ok!"))
        // }
    }else{
        next(createHttpError(401, "Please provide credentials in Authorization header!"))
    }
}