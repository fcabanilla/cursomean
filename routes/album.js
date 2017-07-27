'use strict'

const express = require('express');
const AlbumController = require('../controllers/album');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/album'})

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);

module.exports = api;
