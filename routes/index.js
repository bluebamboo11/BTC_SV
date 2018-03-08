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
    console.log(trade);
    publicClient.getOrderBook(function (err, dataOrder) {
        console.log(dataOrder);
        var privateClient = new Yobit(trade.apiKey, trade.apiSecret);
        privateClient.getInfo(function (err, dataInfo) {
            privateClient.addTrade(function (err, data) {
                console.log( dataOrder[trade.code+'_btc']);
                res.send(dataOrder[trade.code+'_btc'].bids[0][0] - 0.00000001+'');
            }, trade.code+'_btc', 'sell', dataInfo.return.funds[trade.code], dataOrder[trade.code+'_btc'].asks[0][0] - 0.00000001);
        });
    }, trade.code+'_btc', 1)
});
router.get('/getOrderBook', function (req, res, next) {

});

function buyPrice(trade, res) {
    try {
        trade.code =  trade.code+'_btc';
        publicClient.getTicker(function (err, data) {
            if (err) {
                res.send(err);
            } else {
                if (data[trade.code]) {
                    var price = data[trade.code].low * (1 + trade.percent / 100);
                    var amount = trade.amount / price;
                    var privateClient = new Yobit(trade.apiKey, trade.apiSecret);
                    console.log(trade);
                    privateClient.addTrade(function (err, dataTrade) {
                        console.log(dataTrade);
                        if (err) {
                            res.send(err);
                        } else {
                            setTimeout(function () {
                                privateClient.cancelOrder(function (err, cancel) {
                                    if (err) {
                                        res.send(err);
                                    } else {
                                        cancel.last = data[trade.code].last;
                                        cancel.low = data[trade.code].low;
                                        res.send(cancel);
                                    }
                                }, trade.code, dataTrade.return.order_id);
                            }, 500);
                        }
                    }, trade.code, 'buy', amount, price);
                } else {
                    res.send(data);
                }
            }
        }, trade.code)
    } catch (err) {
        res.send(err)
    }
}


module.exports = router;
