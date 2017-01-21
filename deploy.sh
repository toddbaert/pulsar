#!/bin/bash

export BUILD_ID=DoNotKill

dest=$1

#printf "stopping app...\n"
#forever stop "pulsar-dev"

printf "removing $dest directory...\n"
rm -R $dest

printf "creating $dest directory...\n"
mkdir $dest

printf "copying assets to $dest...\n"
cp -R ./* $dest

printf "starting app...\n"
#forever --sourceDir $dest -l $dest/pulsar.log -o $dest/out.log -e $dest/err.log $dest/development.json
forever --sourceDir $dest start -l $dest/pulsar.log -o $dest/out.log -e $dest/err.log --uid "pulsar-dev" app.js &
sleep 10
forever stop "pulsar-dev"
