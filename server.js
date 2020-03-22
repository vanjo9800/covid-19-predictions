const express = require('express')
const {
    spawn
} = require('child_process');
const app = express()
const port = 8888
const path = require('path')

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/train.csv', (req, res) => {
    res.sendFile(path.join(__dirname + '/train.csv'));
});

app.get('/chart.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/chart.js'));
});

app.get('/node_modules/chart.js/dist/Chart.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/node_modules/chart.js/dist/Chart.js'));
});

app.get('/predict', (req, res) => {

    var dataToSend;
    // spawn new child process to call the python script
    console.log(req.query.country + req.query.province);
    const python = spawn('python', ['predictor.py', req.query.country, req.query.province]);
    // collect data from script
    python.stdout.on('data', function (data) {
        dataToSend = data.toString();
    });

    python.stderr.on('data', function (data) {
        console.log("ERROR: " + data.toString());
    });

    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        res.send(dataToSend)
    });

});

app.get('/places', (req, res) => {

    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python', ['details.py']);
    // collect data from script
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        res.send(dataToSend)
    });

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))