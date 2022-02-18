import express from 'express'
import q2m from "query-to-mongo"
import LikeModel from './schema.js'

const likesRouter = express.Router()


likesRouter.post("/", async(req, res, next)=> {
    try {
        const likes = new LikeModel(req.body)
        const {_id} = await likes.save() 
        res.status(201).send({_id})
    } catch (error) {
        next(error)
    }
})
likesRouter.get("/", async(req, res, next)=> {
    try {
        const selectQuery = q2m(req.query)
        const totalLikes = await LikeModel.countDocuments(selectQuery.criteria)
        const likes = await LikeModel.find().populate({path:"authors"})
        res.send({totalLikes, likes})
    } catch (error) {
        next(error)
    }
})
likesRouter.get("/:likeId", async(req, res, next)=> {})
likesRouter.put("/:likeId", async(req, res, next)=> {})
likesRouter.delete("/:likeId", async(req, res, next)=> {})

export default likesRouter