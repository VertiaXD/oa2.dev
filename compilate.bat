@echo off 
set Compilate=API Client Routine

for %%f in (%Compilate%) do (
    echo Compilating %%f
    cd %%f
    npx tsc
    cd ..
)