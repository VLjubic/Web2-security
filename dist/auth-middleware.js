"use strict";
exports.__esModule = true;
exports.isAuthenticated = exports.requiresAuthentication = exports.setUserInfo = void 0;
function isAuthenticated(req) {
    return req.user !== undefined;
}
exports.isAuthenticated = isAuthenticated;
var realm = "FER-Web2 Examples";
function requiresAuthentication(req, res, next) {
    if (req.user)
        next();
    else {
        res.writeHead(401, { 'WWW-Authenticate': "Basic realm='".concat(realm, "'") });
        res.end('Authentication is needed');
    }
}
exports.requiresAuthentication = requiresAuthentication;
function setUserInfo(req, res, next) {
    if (req.headers.authorization) {
        var data = req.headers.authorization.replace(/^Basic /, '');
        data = Buffer.from(data, 'base64').toString('utf8');
        var loginInfo = data.split(':');
        var username = loginInfo[0];
        var password = loginInfo[1];
        if (password === 'some password') {
            req.user = { username: username };
        }
        else { //invalid username or password
            requiresAuthentication(req, res, next);
            return;
        }
    }
    next();
}
exports.setUserInfo = setUserInfo;
