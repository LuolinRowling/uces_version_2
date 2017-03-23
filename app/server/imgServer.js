'user strict'

var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var util = require('./util.js');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "image/jpg");
    next();
});

app.get('/getImg', function(req, res) {

    var name = req.query.name,
        school = req.query.school,
        studentId = req.query.studentId;

    var fs = require('fs'),
        fileName = "../pics/" + school + "_" + name + "/" + studentId + ".jpg";
    
    console.log(fileName);

    fs.readFile(fileName, 'binary', function(err, file) {
        if (err) {
	        console.log(err);
	        return;
	    }else{ 
            res.writeHead(200, {"Content-Type": "image/jpg"})
            res.write(file, 'binary');
            res.end();
            return;
        }

    })
});

process.on('uncaughtException', function (err) {
  console.log(err);
});

app.listen(7777);
console.log('Listening on port 7777...');