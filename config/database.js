const mongoose = require('mongoose')
const DATABASE_URI = process.env.MONGODB_URI;

async function connectDatabase (){
    try{
            if(!DATABASE_URI){
        
                console.log("err to conect to DB",DATABASE_URI)
                return; 
            }
        mongoose.connect(DATABASE_URI);
        mongoose.connection.on('connected',()=>{
                console.loge("Database is conected,,,,,,,,,,,,,,")
          })
         mongoose.connection.on('error',(error)=>{
            console.error('MongoDB connection error:', error);
             process.exit(1)
         }) 
             
    }catch(err){
        const status=err.status || err.statusCode || 500;
        const name =err.name;
        console.log("failed to connect to Database error is: ",err.message)
        console.log('error name: ', name)
        console.log('failed status:',status)
        process.exit(1)
    }
   
}
module.exports=connectDatabase;