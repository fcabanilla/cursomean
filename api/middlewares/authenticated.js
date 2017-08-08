'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
var secret = 'clave_secreta_curso';

exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({message : 'La peticion no tiene la cabecera de autenticacion'});
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({message : 'El Token ha expirado'});
        }
    } catch (ex) {
        // console.log(ex);
        return res.status(404).send({message : 'El Token es: ' + token});
    }

    req.user = payload;

    next();
};
