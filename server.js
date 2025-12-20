const express = require('express');
require('dotenv').config()
const usersRoute = require('./routes/users');
const postsRoute = require('./routes/posts');
const errorHandler = require("./middleware/errorHandler");
const connectToDatabase = require('./config/database.js')

const app = express();
const PORT = process.env.PORT ||3010;

//middllewar json
app.use(express.json());

 async function  startServer (){
  
  try{
  await  connectToDatabase()
    //for debuging
app.use((req,res,next)=>{
    console.log(`url:${req.url} method: ${req.method}`)
    next();
})
//sucsess
app.get('/health',(req,res)=>{
    res.status(200).json({
    status:"UP",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
    })
})
//lists of endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Blog Post API',
    endpoints: {
      health: 'GET /health',
      posts: {
        list: 'GET /api/posts',
        create: 'POST /api/posts',
        getById: 'GET /api/posts/:id',
        update: 'PUT /api/posts/:id',
        delete: 'DELETE /api/posts/:id',
      },
      users: {
        list: 'GET /api/users',
        create: 'POST /api/users',
        getById: 'GET /api/users/:id',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id',
      }
    }
  });
});

//login
app.get("/login", (req,res)=>{

})
//useing the Routes
app.use('/api/posts',postsRoute);

app.use('/api/users',usersRoute);

//path that not existe 

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

//Error handler
app.use(errorHandler);
//start server
app.listen(PORT,()=>{
    console.log(`server is listenning at :${PORT}`);
})

  }catch(err){
    console.log('error in starting the server :', err)
  }

}

startServer()