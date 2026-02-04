import { ErrorRequestHandler, RequestHandler } from "express";
import mongoose from "mongoose";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

    if(err instanceof mongoose.Error.ValidationError){
        const message = Object.values(err.errors).map((e: any) => e.message)
        res.status(422).json({
            error: message,
            stack: err.stack
        })
    }

    res.status(500).json({
        error: err.message || ',asalah pada server',
        stact: err.stack
    })
}

export const NotFound: RequestHandler = (req, res) => {
    res.status(404).send("rute tidak ada")
}