#! /usr/bin/bash

input_path="data/track_group_results" #path to the data files
query="*_*.json" #query to search for files
output="feature_data.json" #output file

while getopts st flag
do
    case "${flag}" in
        s) query="*Simple*.json";; #simple data set
    esac
done

cd "$input_path"
echo "[" > buffer.json

for i in $(find . -name "$query"); 
do 

value=$(cat $i);


echo $i;

    sed -i 's/"audio_features":{//g' $i >> buffer.json;

done

tr -d '  ' < ../buffer.json | sed '$s/.$/]/' > ../feature_data.json
rm buffer.json
