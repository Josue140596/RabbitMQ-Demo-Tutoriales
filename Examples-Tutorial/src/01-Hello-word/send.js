let amqp = require('amqplib/callback_api');

//Connect to RabbitMQ server
amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  //Here, we'll create a channel
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    //To send, we'll create a queue and a message
    let queue = 'hello';
    let msg = 'Hello world from RabbitMQ';

    channel.assertQueue(queue, {
      durable: false
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });
  //Lastly, we close the connection and exit
  setTimeout(function() {
    connection.close();
    process.exit(0);
}, 5000);
});