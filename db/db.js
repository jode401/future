const mongoose=require('mongoose')
 require('dotenv').config()
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Connected successfully!");
})
.catch((e) => {
    console.log("Connection error:", e);
});

const form=mongoose.Schema({
    email:{
type:String,
required:true
    },
    message:{
type:String,
required:true
    },
    budget:{
type:String,
required:true
    },service:{
type:String,
required:true
    },company:{
type:String,
required:true
    },name:{
type:String,
required:true
    }
})
const model=mongoose.model("PROTENV",form)

module.exports={
    model
}