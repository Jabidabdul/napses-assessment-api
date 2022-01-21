const http = require('http');
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const routes = require('./routes/routePages')
dotenv.config();
const PORT = 5000;

mongoose.connect(process.env.DATABASE_ACCESS)
.then(()=>{
    console.log("DB connected")
}).catch((error)=>{
    console.log(error)
})
app.use(cors());
app.use(express.json())
app.use('/', routes);

app.listen(PORT,(req,res)=>{
    console.log(`Server listening to port: ${PORT}`);
});