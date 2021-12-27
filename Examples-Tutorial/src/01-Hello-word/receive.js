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
    let queue = 'hello';

    channel.assertQueue(queue, {
      durable: false,
    });
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(queue, (msg)=> {
        console.log(" [x] Received %s", msg.content.toString());
      },
      {
        noAck: true,
      }
    );
  });
});
