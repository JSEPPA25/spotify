const e = require('express');
const fs = require('fs');
var mysql = require('mysql');
const { title } = require('process');

console.log("Initializing data structures")

//Hash maps to store song data and history
var songs = []
var totalPlays = 0
var history = []

var con = mysql.createConnection({ //SQL connection variables
    user: "sonar",
    password: "vibe",
    server: "localhost",
    database: "spotifydata",
});

con.connect(function(err) { //Connect to SQL server
    if (err) throw err;
    console.log("Connected!"); //Log connection success
});

//Search for file "data.json" in the data folder
fs.readFile('data/data.json', 'utf8', (err, input) => { //Read in the file
    if (err) { console.error(err); return; }

    console.log("File found")
    data = JSON.parse(input) //Parse the JSON data

    console.log("Reading data from file")
    data.forEach(song => { //Iterate over the data
        if (song.spotify_track_uri == null)
            return; //Skip if no URI

        addSong(song)
    });

    dumpData()
        // insertData()

});


function seperate(ts) {

    // Convert UTC to Mountain Time

    const utcDate = new Date(ts);
    const options = { timeZone: "America/Denver", hour12: false };
    const mountainDate = utcDate.toLocaleString("en-US", options);

    // Extracting individual components
    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0');
    const day = String(utcDate.getDate()).padStart(2, '0');
    const hours = String(utcDate.getHours()).padStart(2, '0');
    const minutes = String(utcDate.getMinutes()).padStart(2, '0');
    const seconds = String(utcDate.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

    return formattedDate;


}

function addSong(song) {
    totalPlays += 1 //Increment total plays

    let id = song.spotify_track_uri

    //Remove special characters from the song name
    let title = song.master_metadata_track_name.replaceAll("'", "''")
    let artist = song.master_metadata_album_artist_name.replaceAll("'", "''")
    let album = song.master_metadata_album_album_name.replaceAll("'", "''")

    if (!(id in songs)) {
        songs[id] = title
        songs.push({ id: id, title: title, artist: artist, album: album })
    }

    history.push({ id: id, timestamp: seperate(song.ts), play_amount: song.ms_played, song_number: totalPlays });

}

function insertData() {

    //SONGS TABLE
    var sql = "TRUNCATE TABLE songs";
    con.query(sql, function(err, result) { //Clears the table to prevent duplicates
        if (err) throw err;
        console.log("songs table emptied");
    });

    var sql = "INSERT INTO songs (id, name, album, artist) VALUES ?";
    var values = songs.map(({ id, title, album, artist }) => [id, title, album, artist]) //Map the data to the correct columns
    con.query(sql, [values], function(err, result) { //Insert the data in bulk
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });


    //HISTORY TABLE
    var sql = "TRUNCATE TABLE history";
    con.query(sql, function(err, result) { //Clears the table to prevent duplicates
        if (err) throw err;
        console.log("history table emptied");
    });

    var sql = "INSERT INTO history (id, timestamp, play_amount, song_number) VALUES ?";
    var values = history.map(({ id, timestamp, play_amount, song_number }) => [id, timestamp, play_amount, song_number]) //Map the data to the correct columns
    con.query(sql, [values], function(err, result) { //Insert the data in bulk
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
    });
}

function dumpData() {
    let results = songs.map(song => song.id.slice(-22)).join('\n');
    fs.writeFile('data/songs.txt', results, (err) => {
        if (err) throw err;
        console.log('Songs saved to songs.txt');
    });
}