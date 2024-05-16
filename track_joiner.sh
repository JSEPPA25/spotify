#! /usr/bin/bash

# Takes in the Streaming_History files and combines them into a singular file "data.json" 

input_path="data/track_group_results" #path to the data files
query="*.json" #query to search for files
output="track_data.json";; #output file
# -s flag to use the simple data set (for testing purposes)
# while getopts st flag
# do
#     case "${flag}" in
#         s) query="*simple_Audio*";; #simple data set
#         t) input_path="data/track_group_results" #path to the data files
#            query="*.json" #query to search for files
#            output="track_data.json";; #output file
#          #test data set
#     esac
# done

# Navigating to the directory
cd "$input_path"

# create a new file
echo "[" > buffer.json

# for each data file, append the data to the new file
for i in $(find . -maxdepth 2 -name "$query" | sort); 
do 
echo $i
tr -d '\[' < $i | tr '\]' ','>> buffer.json;

done

#trim and add ending character
tr -d '  ' < buffer.json | sed '$s/.$/]/' > $output
# rm buffer.json
