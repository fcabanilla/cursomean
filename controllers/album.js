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
    });


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

function getAlbums(req, res) {
    var artistId = req.params.artist;
    if (!artistId) {
        // SACAR TODOS LOS ALBUMS DE LA BD
        var find = Album.find({}).sort('title');
    } else {
        // SACAR LOS ALBUMS DE UN ARTISTA EN CONCRETO DE LA BD
        var find = Album.find({artist: artistId}).sort('year');
    }
    find.populate({path: 'artist'}).exec((err, albums) => {
        if (err) {
            res.status(500).send({message: 'Error en la peticion'});
        } else {
            if (!albums) {
                res.status(404).send({message: 'No hay albums'});
            } else {
                res.status(200).send({albums});
            }
        }
    });
}

function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) =>{
        if (err) {
            res.status(500).send({message:'Error en la peticion'});
        } else {
            if (!albumUpdated) {
                res.status(404).send({message:'No se ha actualizado el album'});
            } else {
                res.status(200).send({albumUpdated});
            }
        }
    });
}

function deleteAlbum(req, res) {
    var albumId = req.params.id;

    Album.findByIdAndRemove (albumId, (err, albumRemoved) =>{
        if (err) {
            res.status(500).send({message: 'Error al eliminar el album'});
        } else {
            if (!albumRemoved) {
                res.status(404).send({message: 'El album no ha sido eliminado'});
            } else {
                // res.status(200).send({albumRemoved});

                Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                    if (err) {
                        res.status(500).send({message: 'Error al eliminar el cancion'});
                    } else {
                        if (!songRemoved) {
                            res.status(404).send({message: 'La cancion no ha sido eliminado'});
                        } else {
                            res.status(200).send({album: albumRemoved});
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jpeg') {
            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
                if (err) {
                    res.status(500).send({message: 'Error al actualizar el album'});
                } else {
                    if (!albumUpdated) {
                        res.status(404).send({message: 'No se ha podido actualizar el album'});
                    } else {
                        res.status(200).send({album: albumUpdated});
                    }
                }
            });
        } else {
            res.status(200).send({message:'Extension del archivo no valida'});
        }

    } else {
        res.status(200).send({message:'No has subido ninguna imagen...'});
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albums/'+imageFile;

    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {

        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};
