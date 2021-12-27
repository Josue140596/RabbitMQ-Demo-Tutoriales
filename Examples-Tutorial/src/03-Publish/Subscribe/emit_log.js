const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    // Exchange's name
    let exchange = 'logs';
    //Message
    let msg = process.argv.slice(2).join(' ') || 'Hello World!';
    // fanout is the type of exchange. There are 3 types of exchange
    // fanout broadcasts all the messages it receives to all the
    // queues it knows
    channel.assertExchange(exchange, 'fanout', {
      durable: false
    });
    // The empty string as second parameter means that we don't want to send the message to any specific queue. 
    // We want only to publish it to our 'logs' exchange.
    channel.publish(exchange, '', Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0);
  }, 500);
});