import {Request, Response, NextFunction} from 'express'
export const unauthorizedHandler = (err:any, req:Request, res:Response, next:NextFunction) => {
    if (err.status === 401) {
      res.status(401).send({
        status: "error",
        message: err.message || "You are not logged in!",
      })
    } else {
      next(err)
    }
  }
  
  export const forbiddenHandler = (err:any, req:Request, res:Response, next:NextFunction) => {
    if (err.status === 403) {
      res.status(403).send({
        status: "error",
        message: err.message || "You are not allowed to do that!",
      })
    } else {
      next(err)
    }
  }
  
  export const catchAllHandler = (err:any, req:Request, res:Response, next:NextFunction) => {
    console.log(err)
    res
      .status(500)
      .send({ status: "error", message: "Something bad happened in server side!" })
  }