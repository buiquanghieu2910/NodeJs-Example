const express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

require('dotenv').config();

process.env.TZ = "Asia/Ho_Chi_Minh";
port = process.env.PORT || 8888;
app.listen(port);
console.log('API server started on: ' + port);

var cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var routers = require('./routers/Api'); //importing route
app.use('/api', routers); //register the route


