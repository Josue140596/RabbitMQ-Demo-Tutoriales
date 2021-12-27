const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    let exchange = 'logs';

    channel.assertExchange(exchange, 'fanout', {
      durable: false
    });
    // we create a non-durable queue with a generated name:
    channel.assertQueue('', {
      exclusive: true
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      channel.bindQueue(q.queue, exchange, '');

      channel.consume(q.queue, function(msg) {
        if(msg.content) {
          let secs = msg.content.toString().split('.').length - 1;
            console.log(" [x] %s", msg.content.toString());
            setTimeout(function() {
              console.log(" [x] Done");
            }, secs * 1000);
          }
      }, {
        noAck: true
      });
    });
  });
});