'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated')

const multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/user'})

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.get('/get-image-user/:imageFile', UserController.getImageFile);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);

module.exports = api;
