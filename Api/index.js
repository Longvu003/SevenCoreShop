const express =require('express')
const app=express()
const mongoose= require('mongoose')
const config=require('./config')

mongoose.connect(config.url)
.then(() => {console.log("Connected to MongoDB")})
.catch((err) => console.log(err));

app.listen(config.PORT, () => {
  console.log(`Your server available at http://localhost:${config.PORT}`);
})



