const express =require('express')
const app=express()
app.use(express.json())
const mongoose= require('mongoose')
const config=require('./config')
const Userrouter =require('./router/userRouter')
const cors = require('cors');
app.use(cors());
app.use('/',Userrouter)


mongoose.connect(config.url)
.then(() => {console.log("Connected to MongoDB")})
.catch((err) => console.log(err))



app.listen(config.PORT, () => {
  console.log(`Your server available at http://localhost:${config.PORT}`);

})



