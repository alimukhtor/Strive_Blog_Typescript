import express from 'express'
import q2m from "query-to-mongo"
import BlogsModel from './schema.js'
import {userAuth} from '../userAuth/userAuth.js'
import { userOnlyMiddleware } from "../userAuth/user.js";
import { JWTAuthMiddleware } from '../userAuth/token.js';
const blogRouter = express.Router()

blogRouter.post("/", async(req, res, next)=> {
    try {
        const blogs = new BlogsModel(req.body)
        const { _id } = await blogs.save() 
        res.status(201).send({_id})
    } catch (error) {
        next(error)
    }
})
blogRouter.get("/", JWTAuthMiddleware, async(req, res, next)=> {
    try {
        console.log("Req query:", q2m(req.query));
        const selectQuery = q2m(req.query)
        const total = await BlogsModel.countDocuments(selectQuery.criteria)
        const blogs = await BlogsModel.find(selectQuery.criteria)
        .sort(selectQuery.options.sort)
        .skip(selectQuery.options.skip || 0)
        .limit(selectQuery.options.limit)
        .populate("authors")
        // .populate("users")
        .populate({path:"likes", select:"isliked"})
        res.send({links:selectQuery.links("/blogs", total), pageTotal: Math.ceil(total / selectQuery.options.limit), total, blogs})
    } catch (error) {
        next(error)
    }
})
blogRouter.get("/me/stories", JWTAuthMiddleware, async(req, res, next)=> {
    try {
        const blogs = await BlogsModel.find().populate("authors")
        const myBlogs = blogs.filter(blog => blog.authors[0].role  === "User")
        res.send(myBlogs)
    } catch (error) {
        next(error)
    }
})
blogRouter.get("/:blogId", JWTAuthMiddleware, async(req, res, next)=> {
    try {
        const blogId = await BlogsModel.findById(req.params.blogId)
        res.send(blogId)
    } catch (error) {
        next(createHttpError(404, `User with id ${blogId} not found!`))
    }
})
blogRouter.put("/:blogId", JWTAuthMiddleware, async(req, res, next)=> {
    try {
        const blogId = req.params.blogId
        const updateBlog = await BlogsModel.findByIdAndUpdate(blogId, req.body, {new:true})
        res.send(updateBlog)
    } catch (error) {
        next(createHttpError(404, `User with id ${blogId} not found!`))
    }
})
blogRouter.delete("/:blogId", JWTAuthMiddleware, async(req, res, next)=> {
    try {
        const blogId = req.params.blogId
        await BlogsModel.findByIdAndDelete(blogId)
        res.send()
    } catch (error) {
        next(createHttpError(404, `User with id ${blogId} not found!`))
    }
})

blogRouter.post("/:blogId/comments", async(req, res, next)=> {
    try {
        const getBlogId = await BlogsModel.findById(req.params.blogId, {_id:0})
        // console.log("BLogId:", getBlogId);
        if(getBlogId){
            const postComment = { ...getBlogId.toObject(), commentedDate: new Date(), rate:req.body.rate, commentArea:req.body.commentArea} 
            // console.log("Poste comment:", postComment);
            const modifyBlog = await BlogsModel.findByIdAndUpdate(req.params.blogId, {$push:{comments:postComment}}, {new:true})
            if(modifyBlog){
                res.send(modifyBlog)
            }else{
                next(createHttpError(404, `User with id ${blogId} not found!`))
            }
        }
    } catch (error) {
        next(error)
    }
})
blogRouter.get("/:blogId/comments", async(req, res, next)=> {
    try {
        const blogs = await BlogsModel.findById(req.params.blogId)

        if(blogs){
            res.send(blogs.comments) //res.send(blogs.comments.slice(0,10)) gives me 10 record comments
        }else{
            next(createHttpError(404, `User with id ${blogId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})
blogRouter.get("/:blogId/comments/:commentId", async(req, res, next)=> {
    try {
        const blogsId = await BlogsModel.findById(req.params.blogId)
        if(blogsId){
            const postedComment = blogsId.comments.find(comment=> comment._id.toString() === req.params.commentId)
            if(postedComment){
                res.send(postedComment)
            }else{
                // console.log("error");
                next(createHttpError(404, `User with id ${req.params.commentId} not found!`))
            }
        }else{
            next(createHttpError(404, `User with id ${blogId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})
blogRouter.put("/:blogId/comments/:commentId", async(req, res, next)=> {
    try {
        const blogs = await BlogsModel.findById(req.params.blogId)
        if(blogs){
            const commentIndex = blogs.comments.findIndex(comment => comment._id.toString() === req.params.commentId)
            if(commentIndex !== -1){
                blogs.comments[commentIndex] = {...blogs.comments[commentIndex].toObject(), ...req.body}
                await blogs.save()
                res.send(blogs)
            }else{
                next(createHttpError(404, `User with id ${req.params.commentId} not found!`))
            }
        }else{
            next(createHttpError(404, `User with id ${blogId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})
blogRouter.delete("/:blogId/comments/:commentId", async(req, res, next)=> {
    try {
        const modifyBlogs = await BlogsModel.findByIdAndUpdate(
            req.params.blogId,
            {$pull:{comments:{_id:req.params.commentId}}},
            {new:true}
        )
        if(modifyBlogs){
            res.send(modifyBlogs)
        }else{
            next(createHttpError(404, `User with id ${blogId} not found!`))
        }
    } catch (error) {
        next(error)
    }
})


export default blogRouter