🦈 Requirements
NodeJS
Mariadb/MySQL Server
Datacenter/Residential Proxy
Optional:
PM2
🚀 Installation
You need to follow the steps below one by one:
For Linux: ./install.sh
For Windows: ./install.bat
Create a database and fill in the necessary information in Database/index.ts with a database that has all the permissions. (YOUR BOT WILL NOT FUNCTION WITHOUT THIS DATABASE)
After that, go to phpMyAdmin and enter your own ID in the Admin page -> If you don't give anyone ownership from the bot page, you won't be able to add anyone as an owner.
Compile the programs
For Linux: ./compilate.sh
For Windows: ./compilate.bat
Go to the API directory and run npm start (You need to open a command prompt in the API directory.)
PM2: pm2 start dist --name "API" (RECOMMENDED)
Activate your bot by running runClient.sh in the Client directory, if you have correctly followed the above instructions.
Example: ./runClient.sh BotId Token
For Windows: runClient.bat BotId Token
Using Node: node dist/Client/Client.js Token
Place your proxies in the file ips-data_center.json (before running the compilation. If you have already run it, you need to run it again, otherwise modify Client/dist/ips-data_center.json to change your proxies.)


📝 BOT SETTINGS (TO BE DONE STEP BY STEP)
Edit /config.ts in the Client directory and set the REDIRECTION_URI
Example: http://localhost:3000/callback
Example: http://IP:3000/callback
Example: http://DOMAIN:3000/callback
Example: http://DOMAIN/callback
Create a new bot in the Discord Developer Portal.
All intents of the bot must be enabled.
In the OAuth2 section -> General -> Enter the Redirects URL (Your API connection)
Example: http://localhost:3000/callback
Example: http://IP:3000/callback
Example: http://DOMAIN:3000/callback
Example: http://DOMAIN/callback
🔒 GETTING BOT INVITE LINK
In the OAuth2 section, under URL Generator, you can obtain the invite link for your bot. By selecting Administrator, you can grant it the highest permission.

📅 ROUTINE
<!-- Proxy list requirement -->
⚠️ Routine (Refresh) requires a proxy!

To start the routine, go to the Routine directory and run the following command in the command prompt: node dist/Routine
Using PM2: pm2 start dist/Routine/Routine.js --name "Routine" (RECOMMENDED)
