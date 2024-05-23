

const ReportError = (ErrorRaised, Response) => {
    if(process.env.NODE_ENV === 'development' && !ErrorRaised.IsOperational)
        Response.status(ErrorRaised.StatusCode).json({
            Status: ErrorRaised.Status,
            Message: ErrorRaised.message,
            Stack: ErrorRaised.stack,
            Error: ErrorRaised
        });
    else if(ErrorRaised.IsOperational){
        Response.status(500).json({
            Status: ErrorRaised.Status,
            Message: ErrorRaised.message,
            ...(process.env.NODE_ENV === 'development') && ({ Exception: ErrorRaised.Exception })
        });
    }else{
        Response.status(500).json({
            Status: 'Server Error',
            Message: 'Internal Server Error'
        });
    }
};

module.exports = (RaisedError, _, Response, __) => {
    console.log(RaisedError);
    RaisedError.StatusCode = RaisedError.StatusCode || 500;
    RaisedError.Status = RaisedError.Status || 'Server Error';
    ReportError(RaisedError, Response);
}