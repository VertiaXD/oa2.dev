#!/bin/bash
npm install -g typescript ts-node ts-node-dev
npm i

declare -a installPackages=("API" "Client" "Database" "Routine")

for i in "${installPackages[@]}"
do
   echo "Installing $i dependencies"
   cd $i
   npm install
   cd ..
done