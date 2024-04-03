const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('./worker')


app.get('/', (req, res) => {
    return res.status(200).json({
        msg: "Welcome to the Service Worker"
    })
})

app.listen(port, () => {
    console.log(process.env.REDIS_URIfulle);
    console.log(`server listening at ${port}`);
})