
#!/bin/bash


# Path to the songs.txt file
echo "Splitting the songs"

# Path to the songs.txt file

counter=0
num=0
output=""
while IFS= read -r line; do

    # echo $counter $line
    output="${output}${line}%2C"
    counter=$((counter+1))
    if [ $counter -eq 100 ]; then
        echo -n ${output%,} > data/"track_groups"/songs${num}.txt 
        echo ${num}
        counter=0
        num=$((num+1))
        output=""
    fi

done < data/songs.txt 
