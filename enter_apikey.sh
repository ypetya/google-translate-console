#!/bin/bash

apiKey=''

while [[ $apiKey = '' ]] ; do
    echo 'Enter apiKey'
    read -r apiKey
done

echo "export default \"$apiKey\"" > src/api.key.ts