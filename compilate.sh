#!/bin/bash
declare -a Compilate=("API" "Client" "Routine")

for i in "${Compilate[@]}"
do
   echo "Compilating $i"
   cd $i
   npx tsc
   cd ..
done