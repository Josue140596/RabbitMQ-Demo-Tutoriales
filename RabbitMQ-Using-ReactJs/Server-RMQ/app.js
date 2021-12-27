const express = require('express') 
const bodyParser = require('body-parser')
const rabbitMQHandler = require('./connection/connection')
const cors = require("cors");
const app = express()
const router = express.Router()
const server = require('http').Server(app) 
const socketIO = require('socket.io')(server)

const calcSocket = socketIO.of('/calc')

//Consumer
rabbitMQHandler((connection) => {
  connection.createChannel((err, channel) => {
    if (err) {
      throw new Error(err);
    }
    var mainQueue = 'calc_sum'

    channel.assertQueue('', {exclusive: true}, (err, queue) => {
      if (err) {
        throw new Error(err)
      }
      channel.assertExchange(mainQueue, 'fanout', {
        durable: false
      });
      // Relationship between exchange and a queue is called a binding
      channel.bindQueue(queue.queue, mainQueue, '')
      channel.consume(queue.que, (msg) => {
        var result = JSON.stringify({result: Object.values(JSON.parse(msg.content.toString()).task).reduce((accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue)) });
        console.log(result)
        calcSocket.emit('calc', result)
      })
    }, {noAck: true})
  })
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/api', router)
router.route('/calc/sum').post((req, res) => {
    //Producer
    rabbitMQHandler((connection) => {
      connection.createChannel((err, channel) => {
        if (err) {
          throw new Error(err)
        }
        var ex = 'calc_sum'
        var msg = JSON.stringify({task: req.body });
        
        channel.assertExchange(ex, 'fanout', {
          durable: false
        });
        channel.publish(ex, '', Buffer.from(msg))

        channel.close(() => {connection.close()})
      })
    })
  })

server.listen(5555, '0.0.0.0',
  () => {
    console.log('Running at at localhost:5555')
  }
)