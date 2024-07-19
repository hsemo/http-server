const net = require("net");
const {parseHttpReq} = require('./utils.js');

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.setEncoding('utf-8');

    socket.on("close", () => {
        socket.end();
    });

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

        } else {
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        }

        socket.end();
    })
});

server.listen(4221, "localhost");
