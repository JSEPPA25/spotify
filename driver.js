const e = require('express');
const fs = require('fs');
var mysql = require('mysql');


var con = mysql.createConnection({
    user: "sonar",
    password: "vibe",
    server: "localhost",
    database: "spotifydata",
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

var trackList = {}
var artistList = {}
var albumList = {}
var trackNames = {}
var totalPlays = 0

fs.readFile('data/data.json', 'utf8', (err, input) => {
    if (err) {
        console.error(err);
        return;
    }

    data = JSON.parse(input)

    data.forEach(element => {

        let uri = element.spotify_track_uri
        if (uri == null) {
            return;
        }
        totalPlays += 1
        let id = uri.substring(14)
        let track = element.master_metadata_track_name
        let album = element.master_metadata_album_album_name
        let artist = element.master_metadata_album_artist_name

        datetime = seperate(element.ts)

        insertTrack(id, track)
        insert(artist, artistList)
        insert(album, albumList)


    });
    console.log("Total plays: " + totalPlays)
    console.log("Total songs: " + Object.keys(trackNames).length)
    console.log("Total artists: " + Object.keys(artistList).length)
    console.log("Total albums: " + Object.keys(albumList).length)
});



function insert(id, list) {
    if (id in list) {
        list[id] += 1;
        return;
    }
    list[id] = 1;
}

function insertTrack(id, title) {
    if (id in trackList) {
        trackList[id] += 1;
        return;
    }
    trackList[id] = 1;
    trackNames[id] = title;
}

function seperate(ts) {
    let date = new Date(ts)
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    let time = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[1].split(".")[0].split(":").slice(0, 2).join(":")
    return [year, month, day, time]
}


