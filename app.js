//require node modules
const http = require('http');

//file import
const respond = require('./lib/respond.js')

const port = process.env.PORT || 3000;

//create server
const server = http.createServer(respond);

//listen to client request
server.listen(port, () => {
    console.log(`listening on port: ${port}`);
});