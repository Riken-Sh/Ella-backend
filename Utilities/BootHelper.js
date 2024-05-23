

const Https = require('https');
const Http = require('http');
const { CapitalizeToLowerCaseWithDelimitier } = require('./Algorithms');

exports.StandarizedBindingToApplication = ({ Application, Routes, Suffix, Middlewares, Settings }) => {
    (Middlewares).forEach((Middleware) => (
        Application.use(...[((Array.isArray(Middleware)) 
            ? ((typeof Middleware[0] === 'string') ? (Middleware[0], Middleware[1]) 
            : (Middleware[0](Middleware[1])))
            : (Middleware()))])
    ));
    (Routes).forEach((Route) => (
        Application.use(Suffix + CapitalizeToLowerCaseWithDelimitier(Route), require(`../Routes/${Route}`))
    ));
    (Settings.Deactivated).forEach((DeactivatedSetting) => Application.disabled(DeactivatedSetting));
}

exports.GetConfiguredHTTPServerInstance = (Application) => {
    Http.globalAgent.maxSockets = Https.globalAgent.maxSockets = Infinity;
    const SSL = [process.env.SSL_CERT, process.env.SSL_KEY];
    return ((SSL[0]) ? (Https.createServer) : (Http.createServer))({
        key: (SSL[0]) ? (FileSystem.readFileSync(SSL[0])) : (undefined),
        cert: (SSL[1]) ? (FileSystem.readFileSync(SSL[1])) : (undefined)
    }, Application);
};