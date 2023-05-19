const EventEmitter = require('events')
const http = require('http');

class Sales extends EventEmitter {
    constructor() {
        super();
    }
}

const myEmitter = new Sales();

myEmitter.on('newSale', () => {
    console.log('There was a new sale');
});

myEmitter.on('newSale', () => {
    console.log('Customer name: Jonas');
});

myEmitter.emit('newSale');

////////////////////////////////////////////////////////////////

const server = http.createServer();

server.on('request', (req, res) => {
    console.log('Request received');
    res.end('Request received');
    console.log(req.url);
});

server.on('request', (req, res) => {
    console.log('Another request 😄');
});

server.on('close', () => {
    console.log('Server closed');
});

server.listen(8000,'127.0.0.1',()=>{
    console.log('Waiting for request...');
});
