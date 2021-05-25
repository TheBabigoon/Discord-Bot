module.exports = {
    name: 'serverinfo',
    description: 'send informations about the server',
    execute(message, args){ 
      message.channel.inlineReply(okEmbed.addFields({name: 'Server Info', value: `Server Name\t: ${message.guild.name}\nTotal Members\t: ${message.guild.member.Count}`}));
    }
  };