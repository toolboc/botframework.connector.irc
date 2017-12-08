# botframework.connector.irc
Enables Microsoft Bot Framework interactions over IRC.  
Initially created to faciliate [ordering from Starbucks using a Commodore 128 in C64 Mode](https://motherboard.vice.com/en_us/article/wjgzk4/how-to-order-starbucks-coffee-with-a-commodore-128). 

## One-Click Deployment

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://azuredeploy.net/)

## Demo

[![Demo](https://i.imgur.com/0xQkA8I.pngg)](https://www.youtube.com/watch?v=MgGe2rQz8tA)

## Prerequisites
Requires local installation of [node.js](http://nodejs.org) (tested on v6.11.4)

## Usage
Install dependencies

> npm install

Modify the configuration in index.js

	var config = {
	channels: ["#cougarcs"], //comma separated list of channels
	server: "irc.freenode.net", //irc server to connect to
	botName: "Coolbot1101", // NICK for the bot
	directLineSecret: "YOUR_SECRET"/* Your Direct Line secret */
	};

Start the application

> node index.js

Talk to your bot!

## Features
Supports rendering of hero-card content using rudimentary text formatting
