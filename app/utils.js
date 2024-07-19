module.exports.parseHttpReq = parseHttpReq;

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
