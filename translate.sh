#!/bin/bash

basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")
node $basedir/node_modules/google-translate-console/dist/index.js $@