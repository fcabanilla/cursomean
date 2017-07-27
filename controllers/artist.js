'use strict'

const path = require('path');
const fs = require('fs');
const mongoosePaginate = require('mongoose-Pagination');

const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

function getArtist(req, res) {
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if (err) {
            // 500
            res.status(500).send({message:'Error en la peticion'});
        } else {
            if (!artist) {
                // 404
                res.status(404).send({message:'El artista no existe'});
            } else {
                // 200
                res.status(200).send({artist});
            }
        }
    })

}

function getArtists(req, res) {
    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;

    }
    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, function (err, artists, total) {
        if (err) {
            // 500
            res.status(500).send({message: 'Error en la peticion.'});
        } else {
            if (!artists) {
                // 404
                res.status(404).send({message: 'No hay artistas !!'});
            } else {
                // 200
                return res.status(200).send({
                    total_items: total,
                    artists: artists
                });
            }
        }
    });
}

function saveArtist(req, res) {
    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) =>{
        if (err) {
            res.status(500).send({message: 'Error al guardar el artista'});
        } else {
            if (!artistStored) {
                res.status(404).send({message: 'El artista no ha sido guardado'});
            } else {
                res.status(200).send({artist: artistStored});
            }
        }
    })

}

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) =>{
        if (err) {
            // 500
            res.status(500).send({message: 'Error al guardar el artista'});
        } else {
            if (!artistUpdated) {
                // 404
                res.status(404).send({message: 'El artista no ha sido actualizado'});
            } else {
                // 200
                res.status(200).send({artistUpdated});
            }
        }
    });
}

function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
            // 500
            res.status(500).send({message: 'Error al eliminar el artista'});
        } else {
            if (!artistRemoved) {
                // 404
                res.status(404).send({message: 'El artista no ha sido eliminado'});
            } else {
                // 200
                // console.log(artistRemoved);
                // res.status(200).send({artistRemoved});

                Album.find ({artist: artistRemoved._id}).remove((err, albumRemoved) =>{
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
                                        res.status(200).send({artistRemoved});
                                    }
                                }
                            });
                        }
                    }
                });


            }
        }
    });
}


function uploadImage(req, res) {
    var artistId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jpeg') {
            Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
                if (err) {
                    res.status(500).send({message: 'Error al actualizar el album'});
                } else {
                    if (!artistUpdated) {
                        res.status(404).send({message: 'No se ha podido actualizar el album'});
                    } else {
                        res.status(200).send({message: artistUpdated});
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
    var path_file = './uploads/artists/'+imageFile;

    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {

        }
    });
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};





// res.status().send({message: ''});
