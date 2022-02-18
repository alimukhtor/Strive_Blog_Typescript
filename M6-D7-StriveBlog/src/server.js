import express from 'express'
import listEndpoints from 'express-list-endpoints'
import mongoose from 'mongoose'
import cors from 'cors'
import passport from 'passport'
import { unauthorizedHandler, forbiddenHandler, catchAllHandler } from './services/errorHandlers.js'
Zxadasfs
import googleStrategy from './services/userAuth/oauth.js'
const server = express()
const port = process.env.PORT || 3001

import blogRouter from '../src/services/blogs/blog.js'
import authorRouter from './services/authors/index.js'
import likesRouter from './services/likes/index.js'

// ************************************* MIDDLEWARES *****************************
passport.use(googleStrategy)

server.use(cors())
server.use(express.json())
server.use(passport.initialize())


// *************************************** ROUTES ********************************
server.use("/blogs", blogRouter)
server.use("/authors", authorRouter)
server.use("/likes", likesRouter)
// ****************************** ERROR HANDLERS **************************

// server.use(unauthorizedHandler)
// server.use(forbiddenHandler)
// server.use(catchAllHandler)


// ************************************** DB CONNECTIONS **********************************


mongoose.connect("mongodb+srv://alimukhtor:alimukhtor@cluster0.9wscl.mongodb.net/striveBlog?retryWrites=true&w=majority")
mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB!")
  
    server.listen(port, () => {
      console.table(listEndpoints(server))
      console.log(`Server running on port ${port}`)
    })
  })




