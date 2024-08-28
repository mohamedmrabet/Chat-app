import express from "express"
import dotenv from "dotenv"
import  pool from './db/connectToPst.js'; 
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js" 
import MessageRoutes from './routes/message.route.js'
import UserRoutes from './routes/user.route.js'

const app = express()


app.use(express.urlencoded({ extended: true }));

dotenv.config()

const port = process.env.port || 5000

app.use(express.json());
app.use(cookieParser());

app.get('/',(req ,res )=>{
    //root route http://localhost:5000
    res.send('Hello World')
})



app.use('/auth' , authRoutes)
app.use('/api/' , MessageRoutes)
app.use('/user' , UserRoutes)




app.listen (port , ()=>{
    console.log(`server is running on port ${port}`)
} )