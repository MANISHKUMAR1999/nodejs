const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');
const dbConnect = require('./config/dbConnect');
const userRoute = require('./routes/userRoutes')
const blogRoute = require('./routes/blogRoutes');
const cloudinaryConfig = require('./config/cloudinaryConfig');
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT || 5000

const app = express();


app.use(express.json());
app.use(cors())
app.use('/api/v1',userRoute)
app.use('/api/v1',blogRoute)









app.listen(PORT,()=>{
console.log("server started",PORT)
dbConnect()
cloudinaryConfig()
})