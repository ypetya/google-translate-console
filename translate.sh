#!/bin/bash

# target language
basedir="$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")"
node "$basedir/dist/index.js" $@