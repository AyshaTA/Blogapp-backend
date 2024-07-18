const Express = require("express")
const Mongoose = require("mongoose")
const Bcrypt = require("bcrypt")
const Cors = require( "cors")
const Jsonwebtoken= require( "jsonwebtoken")

let app= Express()

app.use(Express.json())
app.use(Cors())


app.post("/signup",(req,res)=>{
    let data=req.body
    let hashedPassword = Bcrypt.hashSync(req.body.password,10)
    console.log(hashedPassword)
    req.body.password=hashedPassword
    console.log(data)
})

app.listen(3030,()=>{
    console.log("Server Starred")
})