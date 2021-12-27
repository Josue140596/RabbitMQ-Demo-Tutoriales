let amqp = require("amqplib/callback_api");
//Connect to RabbitMQ server
amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  //Here, we'll create a channel
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    //To receive, we'll declare from send.js "hello",
    //we want to sure that the queue exists
    let queue = 'task_queue_bryan';

    channel.assertQueue(queue, {
      // This durable option change needs to be applied to both the producer and consumer code.
      // At this point we're sure that the task won't be lost even if RabbitMQ restarts
      durable: true,
    });
    //With prefetch tells RabbitMQ not to give more than one
    //message to a worker at a time. Or, in other words, don't dispatch a new message
    // until it has processed.
    // it will be dispatch it to the next wroker that is not still busy
    channel.prefetch(1);
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(queue, (msg)=> {
        let secs = msg.content.toString().split('.').length - 1;

        console.log(" [x] Received %s", msg.content.toString());
        setTimeout(function() {
          console.log(" [x] Done");
        }, secs * 1000);
      },
      {
        // Acknowledgment mode  
        // If a consumer dies (its channel is closed, connection is closed, or TCP connection is lost)
        // If a woker dies and has a task will be delivered to another worker
        // 30 minutes by default but you can increase this timeout
        noAck: false,
      }
    );
  });
});
