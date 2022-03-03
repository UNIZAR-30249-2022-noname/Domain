"use strict";
var amqp = require('amqplib/callback_api');
var amqpURL = "amqps://draayoqu:7lDJ4nHZhhKGUn2lQCvw8XE4VNuVxMvD@rat.rmq2.cloudamqp.com/draayoqu";
var args = process.argv.slice(2);
if (args.length == 0) {
    console.log("Usage: rpc_client.js num");
    process.exit(1);
}
amqp.connect(amqpURL, function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        channel.assertQueue('', {
            exclusive: true
        }, function (error2, q) {
            if (error2) {
                throw error2;
            }
            var correlationId = generateUuid();
            var mensaje = args[0];
            console.log(' [x] Requesting msg(%s)', mensaje);
            channel.consume(q.queue, function (msg) {
                if (msg.properties.correlationId == correlationId) {
                    console.log(' [.] Got %s', msg.content.toString());
                    setTimeout(function () {
                        connection.close();
                        process.exit(0);
                    }, 500);
                }
            }, {
                noAck: true
            });
            channel.sendToQueue('rpc_queue', Buffer.from(mensaje.toString()), {
                correlationId: correlationId,
                replyTo: q.queue
            });
        });
    });
});
function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}
