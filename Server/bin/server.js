'use strict'
const app = require('../src/app');
const http = require('http');
const debug = require('debug')('http');
const cors = require('cors');
const WebSocketServer = require('websocket').server;
const websocketlistener = require('../src/websocket-request');
const { errors } = require('celebrate');

const port = normalizePort(process.env.PORT || 4001);
app.set('port', port);
app.use(errors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening)
console.log('Api rodando na porta ' + port)

//Criando o websocket
const websocket = new WebSocketServer({
    httpServer: server
});

websocket.on('request', websocketlistener);

function onListening(){
    const addr = server.address();
    const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
    debug('Listening on ' + bind)
}

function normalizePort(val){
    const port = parseInt(val,10);
    if(isNaN(port)){
        return val;
    }

    if(port >= 0){
        return port;
    }

    return false;
}

function onError(error){
    if (error.syscall !== 'listen'){
        throw error;
    }

    const bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port
    switch(error.code){
        case 'EACCES':
            console.error(bind + ' require elevated privileges')
            process.exit(1);
            break
        case 'EADDRINUSE':
            console.error(bind + 'is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}
