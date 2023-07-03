@REM Path: runClient.bat
@echo off
set args1=%1
set args2=%2

pm2 start --time --namespace "oa2-bot" --name "oAuth-%args1%" ./dist/Client -- "%args2%"
pm2 logs "oAuth-%args1%"