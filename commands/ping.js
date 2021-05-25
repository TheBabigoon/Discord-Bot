module.exports = {
    name: 'ping',
    description: 'command to show latencies',
    execute(message, args){ 
      message.inlineReply(`Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
    }
  };