const Express = require("express")
const Mongoose = require("mongoose")
const Bcrypt = require("bcrypt")
const Cors = require( "cors")
const Jsonwebtoken = require("jsonwebtoken")
const userModel =require("./models/users")
const postModel =require("./models/post")
const res = require("express/lib/response")
const { JsonWebTokenError } = require("jsonwebtoken")
const jsonwebtoken = require("jsonwebtoken")
let app= Express()

app.use(Express.json())
app.use(Cors())
Mongoose.connect("mongodb+srv://ayshata2002:ayshata2002@cluster0.zqsv2.mongodb.net/blogappdb?retryWrites=true&w=majority&appName=Cluster0")


app.post("/create",async(req,res)=>{
    let input=req.body
    let token=req.headers.token
    Jsonwebtoken.verify(token,"blogApp",async(error,decoded)=>{
        if (decoded && decoded.email){
            let result=new postModel(input)
            await result.save()
            res.json({"status" : "Success"})
        }else{
            res.json({"status" : "invalid Authentication"})
        }
    })

})





app.post("/signln",async(req,res) => {
    let input = req.body 
    let result = userModel.find({email: req.body.email}).then(
        (item) => {
            if(item.length>0){
                const passwordValidator = Bcrypt.compareSync(req.body.password,item[0].password)
                if(passwordValidator){
                    jsonwebtoken.sign({email: req.body.email},"blogApp",{expiresIn:"1d"},
                        (error,token) => {
                            if(error) {
                                res.json({"status":"error","errorMessage":error})

                            }else{
                                res.json({"status":"success","token":token,"userId":item[0]._id})

                            }
                        }
                    )
                }
                else{
                    res.json({"status":"Incorrect Password"})

                }
            }else{
                res.json({"status":"Invalid email id"})

            }
        }
    )
    })



    


app.post("/signup",async(req,res)=>{
    let input=req.body
    let hashedPassword = Bcrypt.hashSync(req.body.password,10)
    console.log(hashedPassword)
    req.body.password=hashedPassword
    userModel.find({email:req.body.email}).then(
        (item) => {

            if(item.length>0)
                {
                    res.json({"status":"email Id already exist"})
                }else{
        
                    let result= new userModel(input)
                    result.save()
                   res.json({"status":"sucess"})
                } 

        }
    ).catch(
        (error)=>{}
    )
}
)
app.listen(3030,()=>{
    console.log("Server Started")
})