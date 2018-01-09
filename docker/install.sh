#!/bin/bash

currentDirectory=$(dirname $0)
projectDirectory=$(realpath $currentDirectory/..)

docker run --interactive --tty \
    --user=$(id -u) \
    --volume $projectDirectory:/workspace \
    --workdir /workspace \
    node:9 \
    npm install
