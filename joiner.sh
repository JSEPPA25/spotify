#! /usr/bin/bash

input_path="data"
query="*y_Audio*"

while getopts s flag
do
    case "${flag}" in
        s) query="*simple_Audio*";; #simple data set
    esac
done

# Navigating to the directory
cd "$input_path"

# create a new file
echo "[" > buffer.json

# for each data file, append the data to the new file
for i in $(find . -maxdepth 1 -name "$query" | sort); 
do 
echo $i
tr -d '\[' < $i | tr '\]' ','>> buffer.json;
done

#trim and add ending character
tr -d '  ' < buffer.json | sed '$s/.$/]/' > data.json
rm buffer.json
