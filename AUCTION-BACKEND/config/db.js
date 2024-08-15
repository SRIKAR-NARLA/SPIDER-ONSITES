import mongoose from 'mongoose'

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("connected db")
    }catch(error){
        console.log(`error: ${error.message}`)
        process.exit(1);
    }
}

export default connectDB;