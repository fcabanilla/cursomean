'use strict'

const path = require('path');
const fs = require('fs');
const mongoosePaginate = require('mongoose-Pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

function getAlbum(req, res) {
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) =>{
        if (err) {
            res.status(500).send({message:'Error en la peticion'});
        } else {
            if (!album) {
                res.status(404).send({message:'El album no existe'});
            } else {
                res.status(200).send({album});
            }
        }
        res.status(200).send({message: 'Accion getAlbum'});
    });

    res.status(200).send({message: 'Accion getAlbum'});
}

function saveAlbum(req, res) {
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if (err) {
            // 500
            console.log(err);
            res.status(500).send({message:'Error en el servidor'});
        } else {
            if (!albumStored) {
                // 404
                res.status(404).send({message:'No se ha podido guardar el album'});
            } else {
                // 200
                res.status(200).send({albumStored});
            }
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum
};
