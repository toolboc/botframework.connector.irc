"use strict";
var irc = require("irc");
var botframework = require("botframework-directlinejs");
var ws = require("ws");
var sprintf = require('sprintf-js').sprintf;
var sleep = require('sleep');

global.XMLHttpRequest = require("xhr2");

var lineWidth = 80;

var config = {
	channels: ["#cougarcs"], //comma separated list of channels
	server: "irc.freenode.net", //irc server to connect to
	botName: "Coolbot1101", // NICK for the bot
    directLineSecret: "YOUR_SECRET"/* put your Direct Line secret here */
};

var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});

var conversations = [];

bot.addListener("message", function(from, to, text, message) {

	for(var i in conversations) {
			if(conversations[i].user == message.nick )
			{
				//found an existing conversation
				conversations[i].directline.postActivity({
					from: { id: message.nick }, 
					type: 'message',
					text: text
				}).subscribe(
					id => console.log(id),
					error => console.log("Error posting activity", error)
				);

				return;
			}
			else
			{
				//keep searching through conversations 
				continue;
			}
		}
	
	//no existing conversation found, start a new conversation
	conversations.push({"user" : message.nick, "directline": CreateDirectLine(message)});
});

function CreateDirectLine(message)
{
	var directLine = new botframework.DirectLine({secret:config.directLineSecret});
	
		directLine.postActivity({
			from: { id: message.nick }, 
			type: 'message',
			text: message.text
		}).subscribe(
			id => console.log(id),
			error => console.log("Error posting activity", error)
		);
	
		directLine.activity$
		.subscribe(
			activity => RenderActivity(message.nick, activity)
		);

	return directLine;
}

function RenderActivity(nick, activity){
	if(activity.from.id != nick)
		bot.say(nick, activity.text);
	else
		return

	for(var i in activity.attachments)
	{
		if(activity.attachments[i].contentType == "application/vnd.microsoft.card.hero")
		{
			let herocard = activity.attachments[i];

			if(typeof herocard.content.title !== "undefined")
			{
				bot.say(nick,PrintStarLine());
				var lines = GetLines(herocard.content.title);
				SendLines(nick, lines);
				bot.say(nick,PrintStarLine());
			} 

			if(typeof herocard.content.subtitle !== "undefined")
			{
				bot.say(nick,PrintStarLine());
				var lines = GetLines(herocard.content.subtitle);
				SendLines(nick, lines);
				bot.say(nick,PrintStarLine());
			}	
			
			if (typeof herocard.content.buttons !== "undefined")
			{

				bot.say(nick,PrintStarLine());

				for(var i in herocard.content.buttons)
				{
					var lines = GetLines(herocard.content.buttons[i].title);
					SendLines(nick, lines)

					if(herocard.content.buttons[i].type == "openUrl")
					{
						var lines = GetLines(herocard.content.buttons[i].value);
						SendLines(nick, lines)
					}

				}

				bot.say(nick,PrintStarLine());
			}
		}
	}
}


function SendLines(nick, lines)
{
	for (var i in  lines)
	{
		bot.say(nick, lines[i]);		
		
		//irc reply throttle
		sleep.msleep(1000);
	}

}

function PrintStarLine()
{
	let starline = "%\'*" + (lineWidth) + "s";	
	return sprintf(starline, "*");
}

function GetLines(content)
{
	var lines = [];

	//remove new-line characters
	content = content.replace(/(?:\r\n|\r|\n)/g, ' ');

	//single line response
	if(content.length < lineWidth)
	{
		lines.push(PrintCentered(content));
		return lines;
	}

	//multi-line response
	for (var i = 0;  i <= content.length; i += lineWidth - 4) {
	
		var text = content.substring(i , i + lineWidth - 4);
		if(text.length == lineWidth - 4)
			lines.push("* " + text + " *");
		else
		{
			//last line 
			var end = lineWidth - text.length - 2;
			let pattern = "%\' " + end + "s";	
			lines.push("* " + text + sprintf(pattern,"*"));
		}
	}

	return lines;
}

function PrintCentered(text)
{
	let begin = parseInt(((lineWidth + text.length) / 2 )) - text.length;
	let end = parseInt(lineWidth - (begin + text.length)) - 1;

	let pattern = "*%" + begin + "s" + text + "%" + end + "s";
	return sprintf(pattern, "", "*");
}

bot.addListener('error', function(message) {
    console.log('error: ', message);
});