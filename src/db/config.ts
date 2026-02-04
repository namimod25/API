import { connect } from "mongoose";

const mongoURI = process.env.MONGODB_URI!

connect (mongoURI).then(() => {
    console.log("database terhubung")
}).catch((err) => {
    console.log(err)
})