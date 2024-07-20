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

    return req;
}

function response() {
    var res = Object.create(null);
    res.status = Object.create(null);
    res.headers = Object.create(null);
    res.body = '';

    var statusCodes = {
        200: 'OK',
        404: 'Not Found'
    };

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
        res.status[code] = statusCodes[code];
        return api;
    }

    function header(key, value) {
        res.headers[key] = value;
        return api;
    }

    function body(bd) {
        res.body = bd;
        return api;
    }

    function toString() {
        var resStr = `HTTP/1.1 `;

        resStr += getResStatus() + '\r\n';

        for (let [key, value] of Object.entries(res.headers)) {
            resStr += `${key}: ${value}\r\n`;
        }

        resStr += '\r\n';

        resStr += res.body;

        return resStr;
    }

    // ---------------------------> Private
    function getResStatus() {
        {
            let code = Object.keys(res.status)[0];
            let msg = res.status[code];
            var status = `${code} ${msg}`;
        }
        return status;
    }
}
