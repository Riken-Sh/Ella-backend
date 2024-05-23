

const Express = require('express');
const Router = Express.Router();
const ChatController = require('../Controllers/Chat');

Router.post('/completions', ChatController.HandleCompletion);
Router.get('/providers', ChatController.GetProviders);

module.exports = Router;