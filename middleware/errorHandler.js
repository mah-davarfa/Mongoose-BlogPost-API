const errorHandler=(err,req,res,next)=>{
      // 1) If a response already started, delegate to Express’ built-in handler
  if (res.headersSent) return next(err);


    let message=err?.message  || 'internal error';
    let statusCode= err?.status || err?.statusCode|| 500;
   
    if (err?.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  } else if (err?.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if(process.env.NODE_ENV==='development')
     console.error('Error : ',err)
   
  res.status(statusCode).json({
       error:{
        message,
        statusCode,
        ...(process.env.NODE_ENV === 'development' && {stack:err?.stack})
       }
    })


}
module.exports = errorHandler; 