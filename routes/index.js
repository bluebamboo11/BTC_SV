var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
Yobit = require('yobit');

// Test public data APIs
var publicClient = new Yobit();


router.get('/getInfo', function (req, res, next) {
    publicClient.getTicker(function (err, data) {
        console.log(data);
        res.send(data['eth_btc']);
        return true
    }, 'eth_btc')
});
/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile('index.html');
});
router.post('/addTradeBuy', function (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    var data = req.body;
    buyPrice(data, res);
});
router.post('/addTradeSell', function (req, res, next) {
    if (!req.body) return res.sendStatus(400);
    var trade = req.body;
    publicClient.getOrderBook(function (err, dataOrder) {
        var privateClient = new Yobit(trade.apiKey, trade.apiSecret);
        privateClient.getInfo(function (err, dataInfo) {
            console.log(dataInfo.return.funds.btc+'--'+dataOrder[trade.code].bids[0][0]);
            // privateClient.addTrade(function (err, dataTrade) {
            //
            // }, trade.code, 'sell', dataInfo.return.funds.eth, price);
            res.send(dataInfo);
        });
    }, trade.code, 1)
});

function buyPrice(trade, res) {
    console.log(trade);
    publicClient.getTicker(function (err, data) {
        if (err) {
            res.send(err);
        } else {
            if (data[trade.code]) {
                var price = data[trade.code].low * (1 + trade.percent / 100);
                var amount = trade.amount / price;
                var privateClient = new Yobit(trade.apiKey, trade.apiSecret);
                privateClient.addTrade(function (err, dataTrade) {
                    if (err) {
                        res.send(err);
                    } else {
                        dataTrade.last = data[trade.code].last;
                        dataTrade.low = data[trade.code].low;
                        res.send(dataTrade);
                    }
                }, trade.code, 'buy', amount, price);
            } else {
                res.send(data);
            }
        }
    }, trade.code)
}

module.exports = router;
