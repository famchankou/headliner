var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');


app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* Serving from the same express Server No cors required */
app.use(express.static('../client'));
app.use(bodyParser.json());

var newFilename = '';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/app/assets/images');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        newFilename = datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        cb(null, newFilename);
    }
});


var upload = multer({
    storage: storage
}).single('file');


/* API path that will upload the files */
app.post('/upload', function(req, res) {
    upload(req, res, function(err){
        if(err) {
            res.json({error_code:1, err_desc:err});
            return;
        }
        res.json({error_code:0, err_desc:null, new_filename: newFilename});
    });
});

app.listen('3000', function(){
    console.log('The app is running on http://127.0.0.1:3000...');
});