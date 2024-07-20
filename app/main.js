const net = require("net");
const {existsSync, readFileSync} = require('node:fs');
const {parseHttpReq} = require('./utils.js');

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.setEncoding('utf-8');

    socket.on("close", () => {
        socket.end();
    });

    var dir = process.argv[process.argv.indexOf('--directory') + 1];
    dir += (dir.endsWith('/')) ? '' : '/';
    socket.on('data', function handleRequest(data) {
        console.log(data);

        var req = parseHttpReq(data);

        var reqTarget = req.target;

        if (reqTarget === '/'){
            socket.write('HTTP/1.1 200 OK\r\n\r\n');

        } else if (reqTarget.startsWith('/echo')) {
            let echoText = reqTarget.split('/')[2];
            let response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${echoText.length}\r\n\r\n${echoText}`;

            socket.write(response);
        } else if (reqTarget.startsWith('/user-agent')) {
            let userAgent = req.headers['user-agent'];
            socket.write(
                `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`
            );

        } else if (reqTarget.startsWith('/files/')) {
            let absFilePath = reqTarget.replace('/files/', dir);
            console.log('absFilePath: ', absFilePath);
            if(!existsSync(absFilePath)){
                socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
            }
            let fileContent = readFileSync(absFilePath, {encoding: 'utf-8'});
            socket.write(
                `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${fileContent.length}\r\n\r\n${fileContent}`
            );
        } else {
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        }

        socket.end();
    })
});

server.listen(4221, "localhost");
