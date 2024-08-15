const errorHandler = (err, req, res, next) => {
    // Default values for error status and message
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = { ...err };
    error.message = err.message;

    // Handle specific Mongoose errors
    if(err.name==='CastError'){
        error.message = 'Resource not found',
        error.status = 404
    }

    // Send the custom error response
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? null : error.stack,
    });
};

export default errorHandler;

