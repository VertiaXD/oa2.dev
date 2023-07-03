@echo off 
call npm install -g typescript ts-node ts-node-dev
call npm i

set installPackages=API Client Database Routine
:: Loop through array
for %%f in (%installPackages%) do (
    echo Installing %%f
    cd %%f
    npm install
    cd ..
)