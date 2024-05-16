# Spotify

Order of operations 
- Get spotify data, place in data/raw
- combine the data using data_joiner.sh
run driver.js 
- read the file, insert into db and dumb the string of the artist
- run tracksplitter to seperate them into groups of 100
- run api.sh set the paramenters and get the data output 
- run track joiner.sh to combine all the audio feature 
- run driver.js 