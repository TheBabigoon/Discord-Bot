
const Discord = require("discord.js");
const fs = require('fs');
const math = require('discord-math');
const {prefix, token} = require('./config.json');
require("./plugins/extendedMessage");


const client = new Discord.Client();

// const BOTCOMMANDS = require("./commands");

client.on('ready', () => {
    console.log('bot is ready')
})

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
	// with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}


try {
client.on('message', async (message) => {
    const errorEmbed = new Discord.MessageEmbed().setColor('#e50000');
    const warnEmbed = new Discord.MessageEmbed().setColor('#ffd932');
    const okEmbed = new Discord.MessageEmbed().setColor('#02d108');

    //if author of message is a bot, return. This prevents potential infinite loops
    if(message.author.bot) return;
    
    //slices off prefix from our message, then trims extra whitespace, then returns our array of words from the message
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    //splits off the first word from the array, which will be our command
    const command = args.shift().toLowerCase()
    //if our message doesnt start with our defined prefix, dont go any further into function
    if(!message.content.startsWith(prefix)) {
        console.log('no prefix')
        return
    }

    // for (const file of commandFiles) {
    //     const commandName = require(`./commands/${file}`);
    //     const command = args.shift().toLowerCase()
    //     const client = new Discord.Client();

    //     client.commands.set(commandName.name, commandName);

    //     if (command === commandName.name) {
    //         client.commands.get(commandName.name).execute(message, args)
    //     }
    // }
    

    if (command === "hi") {
        message.inlineReply("hello");
    }

    // executeCommand(command);

    // PING, give latency info
    if (command === 'ping') {
        message.inlineReply(`Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
    }
    
    // SAY, say what whe are say
    if (command === 'say' || command === 'katakan'){
        const val = message.content.slice(prefix.length+command.length)
        if (val){
            // delete the what user say
            message.channel.bulkDelete(1, false);
            
            // to exclude the command

            okEmbed.addFields({ name: "Message", value: val })
            message.channel.send(okEmbed)
        }else if (!val && command === 'say'){
            warnEmbed.addFields({ name: "Warning", value: "Please specify the value" })
            message.inlineReply(warnEmbed)
        }else if (!val && command === 'katakan'){
            warnEmbed.addFields({ name: "Warning", value: "katakan opo kontoll?!!!" })
            message.inlineReply(warnEmbed)
        }
    }
    
    if(command === 'msg'){
        // client.channels.cache.find(channel => channel.name === args[0]).send("Hello there!"); // for discord v12
        var ch_id = args[0].toString()
        ch_id = ch_id.slice(2,ch_id.length-1)
        // client.channels.cache.find(channel => channel.name === args[0]).send("hello")// for discord v12

        const val = message.content.slice(prefix.length+command.length+args[0].length+2)

        okEmbed.addFields({ name: "message", value: val });
        client.channels.cache.get(ch_id).send(okEmbed);
        // message.channel.send(ch_id)
    }

    if (command === 'math'){
        let num1 = parseFloat(args[0]);
        let operation = args [1];
        // let num2 = args[2]
        let num2 = parseFloat(args[2]);
        
        if (!num1) return message.channel.send(errorEmbed.addFields({ name: 'Something Went Wrong!', value: 'Num1 needs to be specified!'}));
        if (!operation) return message.channel.send(errorEmbed.addFields({ name: 'Something Went Wrong!', value: 'An operation was not specified!'}));
        if (!num2) return message.channel.send(errorEmbed.addFields({ name: 'Something Went Wrong!', value: 'Num2 needs to be specified!'}));
        try {
        message.channel.send(okEmbed.addFields({ name: "Math", value: `Answer: ${math.calculate(num1, operation, num2)}` }));
        }catch (e) {
            errorEmbed.addFields({ name: 'Something Went Wrong!', value: e});
            message.channel.send(errorEmbed);
    }}

    if (command === 'show')
    {
        if (args[0] === 'mike'){
            okEmbed.setImage('https://i.imgur.com/C5sPyEB.jpg');
            message.channel.send(okEmbed)
        }
    
        if (args[0] === 'sulivan'){
            okEmbed.setImage('https://i.imgur.com/uYLDcDH.jpg');
            message.channel.send(okEmbed)
        }
    }

    // if (command === 'imgur'){
    // var request = this.getWrexMods().require("request");

    // var url = "https://api.imgur.com/3/gallery/search/?q=" + tempVars("search");
    // var client_id = "d835f2037969d40";
    // var tempVarName = "imgur";

    // request.get({
    //     url: url,
    //     json: true,
    //     headers: {
    //         'Authorization': 'Client-ID ' + client_id
    //     }
    // }, (err, res, data) => {

    //     if (err) {
    //         console.error(err.stack ? err.stack : err);
    //     }

    //     this.storeValue(data, 1, tempVarName, cache);
    //     this.callNextAction(cache);
    // });
    // }
    
    if(command === 'rps'){
        var choices = ["rock", "paper", "scissors"];
        var bot_choice = choices[Math.floor((Math.random() * 3))]
        var map = {};

        choices.forEach(function(choice, i) {
            map[choice] = {};
            map[choice][choice] = "Was a tie"
            // map[choice][choices[(i+1)%3]] = choices[(i+1)%3] + " wins"
            // map[choice][choices[(i+2)%3]] = choice + " wins"
            map[choice][choices[(i+1)%3]] = "You Lose!" 
            map[choice][choices[(i+2)%3]] = "You Win!" 
        })

        // function compare(choice1, choice2) {
        //     message.channel.send((map[choice1] || {})[choice2] || "Invalid choice")
        // }

        // let targetUser = message.mentions.members.first();

        try {
        okEmbed.addFields({name: 'Rock Paper Scissors', value : `my choice is  ${bot_choice}, ${(map[args[0]] || {})[bot_choice] || "Invalid choice"}`})
        // message.channel.send(okEmbed)
        message.inlineReply(okEmbed)
        } catch (e) {
            errorEmbed.addFields({ name: 'Something Went Wrong!', value: e });
            message.channel.send(errorEmbed);
        }
        console.log(bot_choice)
    }

    if (command === 'guess' || command === 'tebak'){
        warnEmbed.addFields({name: `Guess a Number`, value: "under construction"})
        message.channel.send(warnEmbed);
        // let value = args[0];
        // if (!value) value = 10;
        // let Num = Math.floor((Math.random() * value) + 1);
        // parseInt(Num);

        // message.channel.send(okEmbed.addFields({name: 'Guess', value: `${message.author} guess number between 1 to ${value}`}))
        // console.log(Num);
    }

    if (command === 'hug'){
        try {
        const val = message.content.slice(prefix.length+command.length)
        let targetMember = message.mentions.members.first();
        if(targetMember) targetMember = targetMember.user;
        if(!targetMember) targetMember = val;
        // message goes below!
        var hugImg = ['to301zX', 'mjuxfiY', 'wOmoeF8', 'BPLqSJC', '6qYOUQF'];

        var randHug = Math.floor((Math.random() * 5));
        console.log(randHug);
        if (val && (args[0]).startsWith('<')){
                okEmbed.addFields({name: 'Hug', value: `***${targetMember} you just got a hug!***`}).setImage(`https://i.imgur.com/${hugImg[randHug]}.gif`);
                message.channel.send(okEmbed);
        }else if(args[0] === 'me'){
            console.log(randHug);
            okEmbed.addFields({name: 'Hug', value: `***${message.author}, here is a hug for you!***`}).setImage(`https://i.imgur.com/${hugImg[randHug]}.gif`);
            message.channel.send(okEmbed);
        }else if(!(args[0]).startsWith('<')){
            warnEmbed.addFields({name: 'Hug', value: `please mention someone!`});
            message.channel.send(warnEmbed);
        }else if(!val){
            warnEmbed.addFields({name: 'Hug', value: `please specify the target!`});
            message.channel.send(warnEmbed);
        }
        } catch (e) {
            errorEmbed.addFields({ name: 'Something Went Wrong!', value: e });
            message.channel.send(errorEmbed);
        }
    }

    if (command === 'slap'){
        try {
        const val = message.content.slice(prefix.length+command.length);
        let targetMember = message.mentions.members.first();
        if(targetMember) targetMember = targetMember.user;
        if(!targetMember) targetMember = val;
            // message goes below!
        var slapImg = ['fm49srQ', 'Agwwaj6', 'YA7g7h7', 'kSLODXO', 'CwbYjBX', 'nuDmQu5', 'wlLCjRo', 'xylnYFw', 'dBUtmsq', 'qwunEAS', 'JEO2XAt', 'ik594Wg', 'MmhPxip','DgCnHoD'];

        var randSlap = Math.floor((Math.random() * slapImg.length));
        console.log(val);
        if (val && (args[0]).startsWith('<')){
            okEmbed.addFields({name: 'Slap', value: `***${targetMember} you just got a slap!***`}).setImage(`https://i.imgur.com/${slapImg[randSlap]}.gif`);
            message.channel.send(okEmbed);
        }else if(args[0] === 'me'){
            console.log(randHug);
            okEmbed.addFields({name: 'Slap', value: `***${message.author}, take this!***`}).setImage(`https://i.imgur.com/${slapImg[randSlap]}.gif`);
            message.channel.send(okEmbed);
        }else if(!(args[0]).startsWith('<')){
            warnEmbed.addFields({name: 'Slap', value: `please mention someone!`});
            message.channel.send(warnEmbed);
        }else if(!val){
            warnEmbed.addFields({name: 'Slap', value: `please specify the target!`});
            message.channel.send(warnEmbed);
        }
        }catch (e) {
            errorEmbed.addFields({ name: 'Something Went Wrong!', value: e });
            message.channel.send(errorEmbed);
        }
    }


    if(command === 'ego') {
        message.react("😀")
        message.reply('wow, what a great post')
    }

    if (command === "clear") {
        let num = args[0];

        //if argument is provided, we need to convert it from string to number
        if (args[0]) {
        //add 1 to delete clear command itself
        num = parseInt(args[0]);
        }
        try
        { //default deletes message itself plus previous
        //bulk delete the messages
        await message.channel.bulkDelete(num, false);
        //notify channel of deleted messages
        // message.channel.send(`deleted  ${args[0]} posts for you`);
        console.log(`deleted  ${args[0]} posts for you`)
        }catch(e){
            errorEmbed.addFields({ name: 'Something Went Wrong!', value: e });
            message.channel.send(errorEmbed);
        }
    }


    //log the command
    console.log('command: ', command)
    //log any arguments passed with a command
    console.log(args)
})   
} catch (error) {
    console.log(error);
}

client.login(token)