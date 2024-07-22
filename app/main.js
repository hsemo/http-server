const net = require("net");
const {existsSync, readFileSync, writeFileSync} = require('node:fs');
const {parseHttpReq, response} = require('./utils.js');

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
            socket.write(response().status(200).toString());

        } else if (reqTarget.startsWith('/echo') && !req.headers['accept-encoding']) {
            let echoText = reqTarget.split('/')[2];
            console.log('echoText: ', echoText);
            socket.write(
                response()
                    .status(200)
                    .header('Content-Type', 'text/plain')
                    .header('Content-Length', echoText.length)
                    .body(echoText)
                    .toString()
            );

        } else if (reqTarget.startsWith('/user-agent')) {
            let userAgent = req.headers['user-agent'];
            socket.write(
                response()
                    .status(200)
                    .header('Content-Type', 'text/plain')
                    .header('Content-Length', userAgent.length)
                    .body(userAgent)
                    .toString()
            );

        } else if (req.method.toLowerCase() == 'get' && reqTarget.startsWith('/files/')) {
            let absFilePath = reqTarget.replace('/files/', dir);
            console.log('absFilePath: ', absFilePath);
            if(!existsSync(absFilePath)){
                socket.write(response().status(404).toString());
                socket.end();
                return;
            }
            let fileContent = readFileSync(absFilePath, {encoding: 'utf-8'});
            socket.write(
                response()
                    .status(200)
                    .header('Content-Type', 'application/octet-stream')
                    .header('Content-Length', fileContent.length)
                    .body(fileContent)
                    .toString()
            );

        } else if (req.method.toLowerCase() == 'post' && reqTarget.startsWith('/files/')) {
            let absFilePath = reqTarget.replace('/files/', dir);
            console.log('absFilePath: ', absFilePath);

            writeFileSync(absFilePath, req.body);

            socket.write(
                response()
                    .status(201)
                    .toString()
            );


        } else if (reqTarget.startsWith('/echo') && req.headers['accept-encoding']) {
            let res = response().status(200);

            if(req.headers['accept-encoding'] === 'gzip'){
                res.header('Content-Encoding', 'gzip');
            }

            socket.write(
                    res
                    .header('Content-Type', 'text/plain')
                    .toString()
            );

        } else {
            socket.write(response().status(404).toString());
        }

        socket.end();
    })
});

server.listen(4221, "localhost");
