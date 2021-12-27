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
    let queue = 'task_queue_bryan';
    let msg = process.argv.slice(2).join(' ') || "Hello World!";

    channel.assertQueue(queue, {
      // This durable option change needs to be applied to both the producer and consumer code.
      // At this point we're sure that the task won't be lost even if RabbitMQ restarts
      durable: true
    });

    channel.sendToQueue(queue, Buffer.from(msg), {
      // Marking messages as persistent doesn't fully guarantee that a message won't be lost. 
      // Although it tells RabbitMQ to save the message to disk
      //  If you need a stronger guarantee then you can use publisher confirms.
      persistent: true});
    console.log(" [x] Sent %s", msg);
  });
  //Lastly, we close the connection and exit
  setTimeout(function() {
    connection.close();
    process.exit(0);
}, 300);
});