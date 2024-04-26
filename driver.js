const e = require('express');
const fs = require('fs');

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


    // Process the data here
    data = JSON.parse(input)



    // {
    //     ts: '2022-08-20T17:12:26Z',
    //     username: 'bowenarrow04',
    //     platform: 'iOS15.5(iPhone13,2)',
    //     ms_played: 108761,
    //     conn_country: 'US',
    //     ip_addr_decrypted: '166.170.45.21',
    //     user_agent_decrypted: 'unknown',
    //     master_metadata_track_name: 'WhereAreWeGoing',
    //     master_metadata_album_artist_name: 'BacktoYours',
    //     master_metadata_album_album_name: 'WhereAreWeGoing',
    //     spotify_track_uri: 'spotify:track:6lmzEQupt0oVdxEiHyr9vg',
    //     episode_name: null,
    //     episode_show_name: null,
    //     spotify_episode_uri: null,
    //     reason_start: 'playbtn',
    //     reason_end: 'trackdone',
    //     shuffle: false,
    //     skipped: null,
    //     offline: false,
    //     offline_timestamp: 1661015438393,
    //     incognito_mode: false
    //   },

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


        // console.log(track + " from " + album + " by " + artist + " [" + id + "]");

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
    // 018-05-02T00:57:28Z
    return ts.split("T")
}


