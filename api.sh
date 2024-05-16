

for i in {98..179}
do
    echo "Processing songs$i.txt"


    target="songs$i.txt" 
    destination=results_$i.json

    if [ -e "data/track_groups/$target" ]; then
        echo "Found source file."

        if [ -e "data/track_group_results/$destination" ]; then
            echo "Result file exists in folder."
            exit 1
        else
            echo "File not found..."
            echo "Making API call..." 

            value=`cat data/track_groups/$target`  

            curl --request GET \
                --url 'https://api.spotify.com/v1/audio-features?ids='$value'' \
                --header 'Authorization: Bearer BQAsXaPTywzF9GXM2vRcatokr0OHc-ulWAD8RtTMF4vCN70xuh1KqGVzCxPVuqSeDSTKjHkaRx_kC4ihUR1dxFecPNuiDy7yWy5XzdRgz64xnrKRw7w' \
                -s \
                > "data/track_group_results/$destination"
        fi

    else
        echo "File not found."
    fi
done