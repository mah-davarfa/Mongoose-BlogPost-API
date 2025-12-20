const mongoose = require('mongoose')
const DATABASE_URI = process.env.MONGODB_URI;

async function connectDatabase (){
    try{
            if(!DATABASE_URI){
        
                console.log("err to conect to DB",DATABASE_URI)
                process.exit(1) 
            }
        await mongoose.connect(DATABASE_URI);
        mongoose.connection.on('connected',()=>{
                console.log("Database is conected,,,,,,,,,,,,,,")
          })
         mongoose.connection.on('error',(error)=>{
            console.error('MongoDB connection error:', error);
             process.exit(1)
         }) 
             
    }catch(err){

        console.log("failed to connect to Database error is: ",err.message)
        process.exit(1)
    }
   
}
module.exports=connectDatabase;