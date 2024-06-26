

const { PythonShell } = require('python-shell');
const { AvailableProviders } = require('../../Utilities/Runtime');

const GPT_PY_FILE = 'GPTHandler.py';

const BasePyShellOptions = {
    mode: 'text',
    // ! -u => Real Time (Streamed GPT Responses)
    pythonOptions: ['-u'],
    // ! <CurrentWorkingDirectory../Third-Party/>
    scriptPath: __dirname,
    args: [JSON.stringify(AvailableProviders)]
};

const FormatPyShellException = (ErrorID, { traceback }) => ({ ErrorID, Exception: traceback });

const HandlePyShellResponse = (Options, PyShell) => new Promise((Resolve, Reject) => {
    PyShell.on('error', (PyShellError) => {
        const FormattedException = FormatPyShellException('GPT::PyShell::Error', PyShellError);        
        Reject(FormattedException);
    });
    PyShell.on('pythonError', (PyShellRuntimeError) => {
        const FormattedException = FormatPyShellException('GPT::PyShell::Python::Error', PyShellRuntimeError);
        Reject(FormattedException);
    });
    PyShell.on('message', (Message) => {
        if(Options?.CommunicationMode === 'WS')
            Options?.Callback?.(Message);
        else
            Resolve(Message);
    });
    PyShell.on('close', () => {
        Resolve();
    });
});

exports.VersionChecker = () => HandlePyShellResponse({}, new PythonShell(GPT_PY_FILE, { ...BasePyShellOptions, args: [ ...BasePyShellOptions.args, null, 'VERSION' ] }));

exports.CollectProviders = () => HandlePyShellResponse({}, new PythonShell(GPT_PY_FILE, { ...BasePyShellOptions, args: [ ...BasePyShellOptions.args, null, 'PROVIDERS' ] }));

exports.GPT = (Query, CommunicationMode, Callback) => HandlePyShellResponse(
    { Callback, CommunicationMode }, new PythonShell(GPT_PY_FILE, {
        ...BasePyShellOptions,
        args: [...BasePyShellOptions.args, JSON.stringify(Query), CommunicationMode]
    }));

module.exports = exports;