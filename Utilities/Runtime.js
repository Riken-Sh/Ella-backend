
exports.AvailableProviders = {
    'WS': [
        'Bing',
        'GeekGpt',
        'Phind',
        'ChatBase',
        'GptGo',
        'ChatForAi',
        'AiAsk',
        'Automatic',
        'GPTalk',
    ],
    'API': [
        'GptGo',
        'GeekGpt',
        'GPTalk',
        'ChatForAi',
        'Aichat',
        'ChatBase',
        'AiAsk',
        'Phind',
        'Acytoo',
        'Bing',
        'You',
        'Automatic'
    ]
};
exports.AvailableRoles = ['user', 'assistant', 'system'];
exports.AvailableModels = ['gpt-3.5-turbo', 'gpt-4'];

exports.DefaultChatParameters = {
    Model: 'gpt-4',
    Role: 'user',
    Provider: 'Automatic'
};

exports.RuntimeError = class extends Error{
    constructor(Message, StatusCode, Exception){
        super(Message);
        this.Exception = Exception;
        this.StatusCode = StatusCode;
        this.Status = `${StatusCode}`.startsWith(4) ? 'Client Error' : 'Server Error';
        this.IsOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
};

exports.CatchAsync = (AsyncFunction) => (Request, Response, Next, ...Arguments) =>
    AsyncFunction(Request, Response, Next, ...Arguments).catch(Next);