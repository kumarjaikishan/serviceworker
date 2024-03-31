const express = require("express");
const app = express();
const port = process.env.PORT || 6000;
const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const sendmail = require('./sendemail');
const push_notification = require('./push_notification');

app.get('/', (req, res) => {
    return res.status(200).json({
      msg: "Welcome to the Service Worker"
    })
  })

const sendEmailhelper = async (n) => {
    return new Promise((res, rej) => setTimeout(() => res(), n * 1000))
}

async function sendEmail(job) {
    const { email, subject, body } = job.data;
    await sendmail(email, subject, body);
    await sendEmailhelper(2);
}
async function pushNotification(job) {
    const { registeredToken, mes } = job.data;
    await push_notification(registeredToken, mes);
    await sendEmailhelper(1);
}
const sharedConnection = new IORedis(process.env.REDIS_URIfulle, {
    maxRetriesPerRequest: null,
    maxmemoryPolicy: 'noeviction', // Set the eviction policy to "noeviction"
});

const worker = new Worker('battlefiesta_queue',
    sendEmail,
    {
        connection: sharedConnection,
    });

worker.on('completed', job => {
    console.log(`${job.id} has completed- Email`);
})

worker.on('failed', (job, err) => {
    console.log(`${job.id} has failed - ${err}`);
})
const worker2 = new Worker('firebase_push_notification',
    pushNotification,
    {
        connection: sharedConnection,
    });

worker2.on('completed', job => {
    console.log(`${job.id} has completed- Push Notification`);
})

worker2.on('failed', (job, err) => {
    console.log(`${job.id} has failed - ${err}`);
})

app.listen(port, () => {
    console.log(`server listening at ${port}`);
  })