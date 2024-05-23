
'use-strict';

(require('dotenv')).config({ path: './.env' });
const Express = require('express');
const Helmet = require('helmet');
const XSS = require('xss-clean');
const Compression = require('compression');
const HPP = require('hpp');
const Cors = require('cors');
const SocketIO = require('socket.io');
const BootHelper = require('./Utilities/BootHelper');
const ChildProcess = require('child_process');

process.on('uncaughtException', (UncaughtServerError) => {
    console.error(UncaughtServerError);
    process.exit(1);
});

const GlobalErrorHandler = require('./Controllers/Error');
const Application = Express();
const Port = process.env.SERVER_PORT || 8000;
const Hostname = process.env.SERVER_HOST || '0.0.0.0';
const { HandleStreamedResponse } = require('./Controllers/Chat');
const { VersionChecker } = require('./Tools/GPT');

BootHelper.StandarizedBindingToApplication({
    Application,
    Suffix: '/api/v1/',
    Routes: [
        'Chat'
    ],
    Middlewares: [
        Helmet,
        [Cors, [ { origin: process.env.CORS_ORIGIN } ]],
        [Express.json, [ { limit: process.env.BODY_MAX_SIZE || '10kb' } ]],
        Compression,
        HPP,
        XSS,
    ],
    Settings: {
        Deactivated: [
            'x-powered-by'
        ]
    }
});

Application.all('*', (Request, Response) => {
    if(Request.path.startsWith('/api/v1/')){
        return Response.status(404).json({
            Status: 'Error',
            Data: {
                Message: 'INVALID_API_REQUEST',
                URL: Request.originalUrl
            }
        })
    }
    Response.redirect(process.env.CLIENT_HOST);
});

Application.use(GlobalErrorHandler);
const WebServer = BootHelper.GetConfiguredHTTPServerInstance(Application);
HandleStreamedResponse(SocketIO(WebServer, { cors: { origin: process.env.CORS_ORIGIN } }));

WebServer.listen(Port, Hostname, () => {
    setInterval(async () => {
        try{
            const Response = await VersionChecker();
            if(Response === 'UP_TO_DATE')
                return;
            ChildProcess.spawn('pip', ['install', '-U', 'g4f']);
        }catch(VersionUpdateError){
            console.warn(VersionUpdateError);
        }
    }, 1000 * 60 * process.env.TIME_FOR_CHECK_AND_UPDATE_PACKAGES); // 3 Minutes
    console.log(`The server was started successfully in the network address (${Hostname}:${Port}).`);
});

process.on('unhandledRejection', (UnhandledServerError) => {
    console.warn(UnhandledServerError);
    WebServer.close(() => process.exit(1));
});
