import express from "express";
import jwt from "jsonwebtoken";
//import { IAuthor } from "../types/authorType";




export const JWTAuthenticate = async (user:IAuthor) => {
    try {
        const accessToken = await generateJWTToken({ _id: user._id})
        return accessToken
    } catch (error) {
    console.log(error);        
    }
  }

const generateJWTToken = (payload:{_id:string}) => 
    new Promise((resolve, reject)=> 
    jwt.sign(payload, process.env.JWT_SECRET_KEY!, {expiresIn:"1d"}, (err, token) => {
        if(err) reject(err)
        else resolve(token)
    }))

export const verifyJWT = (token:string) => new Promise<{_id:string}>((resolve, reject)=> 
    jwt.verify(token, process.env.JWT_SECRET_KEY!, (err, payload)=> {
        if(err) reject(err)
        else resolve(payload as {_id:string})
    })    
)

