module.exports.parseHttpReq = parseHttpReq;
module.exports.response = response;

function parseHttpReq(reqData) {
    reqData = reqData.split('\r\n');

    // request status line
    var req = Object.create(null);
    {
        let [method, target, version] = reqData[0].split(' ');
        Object.assign(req, {method, target, version: version.split('/')[1]});
    }

    // request headers
    req.headers = Object.create(null);
    for (let i = 1; i < reqData.length - 2; i++) {
        let header = reqData[i];
        let headerKey = header.slice(0, header.indexOf(':')).toLowerCase();
        let headerValue = header.slice(header.indexOf(':') + 1).trim();

        req.headers[headerKey] = headerValue;
    }

    req.body = reqData[reqData.length - 1];

    console.log('parsed request: ', req);
    return req;
}

// TODO: make response fucntion able to store binary data
function response() {
    var res = "HTTP/1.1 ";

    var statusCodes = {
        200: 'OK',
        404: 'Not Found',
        201: 'Created'
    };

    var hasBody = false;

    var api = Object.create(null);
    Object.assign(api, {
        status,
        header,
        body,
        toString
    });

    return api;

    // ---------------------------> Public
    function status(code) {
        res += `${code} ${statusCodes[code]}\r\n`;
        return api;
    }

    function header(key, value) {
        res += `${key}: ${value}\r\n`;
        return api;
    }

    function body(bd) {
        res += '\r\n';
        res += bd;
        hasBody = true;
        return api;
    }

    function toString() {
        var resStr = res;
        resStr += hasBody ? '' : '\r\n';

        hasBody = false;
        res = '';

        return resStr;
    }
}
