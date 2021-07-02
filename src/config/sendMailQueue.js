const Queue = require('bull');

const sendMailQueue = new Queue('sendMail', {
    redis: {
        host: '127.0.0.1',
        port: 6379
    }
});

module.exports = sendMailQueue;