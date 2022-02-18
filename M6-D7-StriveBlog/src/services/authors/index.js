import express from 'express'
import AuthorsModel from './schema.js'
import {userAuth} from '../userAuth/userAuth.js'
import { userOnlyMiddleware } from "../userAuth/user.js";
import createHttpError from 'http-errors';
import {JWTAuthenticate} from '../userAuth/tools.js'
import { JWTAuthMiddleware } from '../userAuth/token.js';
import passport from 'passport';

const authorRouter = express.Router()

authorRouter.post("/", async(req, res, next)=> {
    try {
        const author = new AuthorsModel(req.body)
        const {_id} = await author.save()
        res.status(201).send({_id})
    } catch (error) {
        next(error)
    }
})
authorRouter.get("/",  JWTAuthMiddleware, async(req, res, next)=> {
    try {
        const author = await AuthorsModel.find()
        res.send(author)
    } catch (error) {
        next(error)
    }
})

authorRouter.get("/googleLogin", passport.authenticate("google", { scope: ["profile", "email"] })
) 

authorRouter.get("/googleRedirect", passport.authenticate("google", {failureRedirect:`${process.env.GOOGLE_FE_URL}`}), async(req,res,next)=> {
    try {
        console.log("Token:", process.env.GOOGLE_FE_URL);
        console.log("Hi");
        console.log("Token:", req.user.token);
        res.redirect(
            `${process.env.GOOGLE_FE_URL}?accessToken=${req.user.token}`)
    } catch (error) {
        next(error)
    }
})


authorRouter.get("/:authorId", JWTAuthMiddleware, async(req, res, next)=> {
    try {
        const authorId = await AuthorsModel.findById(req.params.authorId)
        res.send(authorId)
    } catch (error) {
        next(error)
    }
})
authorRouter.put("/:authorId", JWTAuthMiddleware, async(req, res, next)=> {
    try {
        const updateAuthor = await AuthorsModel.findByIdAndUpdate(req.params.authorId, req.body, {new:true})
        res.send(updateAuthor)
    } catch (error) {
        next(error)
    }
})
authorRouter.delete("/:authorId", JWTAuthMiddleware, async(req, res, next)=> {
    try {
        await AuthorsModel.findByIdAndDelete(req.params.authorId)
        res.send()
    } catch (error) {
        next(error)
    }
})

authorRouter.post("/register", async(req, res, next)=> {
    try {
        const user = new AuthorsModel({email:req.body.email, password:req.body.password})
        const newUser = await user.save()
        res.send(newUser)
    } catch (error) {
        next(error)
    }
})


authorRouter.post("/login",  async(req, res, next)=> {
    try {
        const {email, password} = req.body
        const author = await AuthorsModel.checkCredentials(email, password)
        if(author){
            const accessToken = await JWTAuthenticate(author)
            res.send({accessToken})
        }else{
            next(createHttpError(401, "Credentials arent ok!"))
        }
    } catch (error) {
        next(error)
    }

})

export default authorRouter