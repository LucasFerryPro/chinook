const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require("./database/db");
const {QueryTypes,Op} = require('sequelize');

//Parcque require un dossier ça veux plus marcher chez moi :/
const Album = require('./models/Album');
const Artist = require('./models/Artist');
const Playlist = require('./models/Playlist');
const Track = require('./models/Track');
const PlaylistTrack = require('./models/playlist.track');
const Passport = require('./models/artist.passport');
const {response} = require("express");

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());


async function verifyDbCon(){
    await sequelize.authenticate()
        .then(() => {
        console.log('Connexion réussie!');
    })
    .catch(err => {
        console.error('Connexion échouée:', err);
    });
}

async function syncModels() {
    try{
        await Passport.sync({alter: true});
        console.log("\nPassport synchronisé\n");
        await Artist.sync({force:false,alter:true});
        console.log("\nArtist synchronisé\n");
        await Playlist.sync({force:false});
        console.log("\nPlaylist synchronisé\n");
        await Track.sync({force:false});
        console.log("\nTrack synchronisé\n");
        await PlaylistTrack.sync({force:false});
        console.log("\nPlaylistTrack synchronisé\n");
        await Album.sync({force:false});
        console.log("\nAlbum synchronisé\n");
    }catch(error){
        console.log(error);
    }
}


//Associations
Playlist.belongsToMany(Track, {through: PlaylistTrack, foreignKey: 'PlaylistId'});
Track.belongsToMany(Playlist, {through: PlaylistTrack, foreignKey: 'TrackId'});

Artist.hasOne(Passport);
Passport.belongsTo(Artist);


//verification de la connexion à la base de données
verifyDbCon();


//Synchronisation des models
syncModels()


//Routes
app.get("/api/playlists",(req, res) => {
    if(!req.query.q){
        Playlist.findAll()
            .then((playlists) => {
                res.status(200).send({success:1,data:playlists});
            })
            .catch((error) => {
                res.status(400).send({success:0,data:error});
            });
    }else{
        Playlist.findAll({
            where: {
                name: {
                    [Op.like]: `%${req.query.q}%`
                }
            }
        })
            .then((playlists) => {
                res.status(200).send({success:1,data:playlists});
            })
            .catch((error) => {
                res.status(400).send({success:0,data:error});
            });
    }
});

app.get("/api/playlists/:id",(req, res) => {

    tracks = [];
    playlistName = "";
    playlistId = req.params.id;
    PlaylistTrack.findAll({
        raw: true,
        nest: true,
        where: {
            PlaylistId: req.params.id
        }
    })
        .then((t) => {
            tracks = t.map((track) => {
                return track.TrackId;
            });
            Playlist.findByPk(req.params.id)
                .then((p) => {
                    playlistName = p.name;
                    Track.findAll({
                        raw: true,
                        nest: true,
                        where: {
                            id: {
                                [Op.in]: tracks
                            }
                        }
                    })
                        .then((track) => {
                            res.status(200).send({success:1,data:{id:playlistId,name:playlistName,tracks:track}});
                        })
                });
        })
});

app.get("/api/tracks/:id",(req, res) => {
    playlists = [];
    trackName = "";
    trackId = req.params.id;
    PlaylistTrack.findAll({
        raw: true,
        nest: true,
        where: {
            TrackId: req.params.id
        }
    })
        .then((t) => {
            playlists = t.map((playlist) => {
                return playlist.PlaylistId;
            });
            Track.findByPk(req.params.id)
                .then((p) => {
                    trackName = p.name;
                    Playlist.findAll({
                        raw: true,
                        nest: true,
                        where: {
                            id: {
                                [Op.in]: playlists
                            }
                        }
                    })
                        .then((playlist) => {
                            res.status(200).send({success:1,data:{id:trackId,name:trackName,playlists:playlist}});
                        })
                });
        });
})

app.get("/api/artists/:id",(req, res) => {
    albums = [];
    artistName = "";
    artistId = req.params.id;
    Album.findAll({
        raw: true,
        nest: true,
        where: {
            ArtistId: req.params.id
        }
    })
        .then((t) => {
            albums = t.map((album) => {
                return album.id;
            });
            Artist.findByPk(req.params.id)
                .then((p) => {
                    artistName = p.name;
                    Album.findAll({
                        raw: true,
                        nest: true,
                        where: {
                            id: {
                                [Op.in]: albums
                            }
                        }
                    })
                        .then((album) => {
                            res.status(200).send({success:1,data:{id:artistId,name:artistName,albums:album}});
                        })
                });
        });
});

app.get("/api/albums/:id",(req, res) => {

});

app.delete("/api/playlists/:id",(req, res) => {
    let {id} = req.params;
    Playlist
        .findByPk(id)
        .then((playlist) => {
            if (playlist){
                return playlist.setTracks([]).then(() => {
                    return playlist.destroy();
                });
            }else{
                return Promise.reject();
            }
        })
        .then(() => {
            res.status(204).send();
        })
        .catch(() => {
            res.status(404).send();
        })
});

app.post("/api/artists",(req, res) => {
    let {name, surname, email, age, password} = req.body;
    Artist.create({
        name: name,
        surname: surname,
        email: email,
        age: age,
        password: password
    }).then((artist) => {
        res.json(artist);
    },(response)=>{
        res.status(422).json({errors: response.errors.map((error) => {
                return {
                    attribute: error.path,
                    message: error.message
                }
            })
        });
    }).catch(error => console.error(error));
});

app.listen(port, () => {
    console.log(`le serveur ecoute sur le port ${port}`);
});
