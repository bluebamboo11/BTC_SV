var express = require('express');
var router = express.Router();
Yobit = require('yobit');

// Test public data APIs
var publicClient = new Yobit();
var privateClient = new Yobit('', '')

router.get('/getInfo', function (req, res, next) {
    publicClient.getTicker(function(err,data){
        console.log(data);
        res.send(data['eth_btc']);
        return true}, 'eth_btc')
});
/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile('index.html');
});

module.exports = router;
