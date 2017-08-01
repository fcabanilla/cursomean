'use strict'

const express = require('express');
const ArtistController = require('../controllers/artist');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

const multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/artists'})

api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.post('/upload-image-artist/:id',  [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);

module.exports = api;
