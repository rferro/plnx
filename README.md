
<img align="right" src="https://cdn.rawgit.com/feross/standard/master/badge.svg">

# plnx

Unofficial Poloniex API client, with public/private methods and push.

[![NPM](https://nodei.co/npm/plnx.png?downloads=true&downloadRank=true)](https://nodei.co/npm/plnx)

## Install

```sh
npm install --save plnx
```

## Use

### Private/Public Methods

```javascript
plnx.METHOD([options], callback);
```

* `options`: object (optional if empty)
* `callback`: function(err, data)

> With private methods, options.key and options.secret are required.

#### Example

```javascript
// public without options
plnx.returnTicker(function(err, data) {
  console.log(err, data);
});

// public with options
plnx.returnOrderBook({ currencyPair: "BTC_ETH" }, function(err, data) {
  console.log(err, data);
});

// private without options
plnx.returnCompleteBalances({ key: "key", secret: "secret" }, function(err, data) {
  console.log(err, data);
});

// private with options
plnx.returnTradeHistory({ key: "key", secret: "secret", currencyPair: "BTC_ETH" }, function(err, data) {
  console.log(err, data);
});

```

### Push

[https://github.com/crossbario/autobahn-js](https://github.com/crossbario/autobahn-js)

```javascript
plnx.push(function(session) {
  session.subscribe("channel", function(data){
    console.log(data);
  });
});
```

## Public and private methods and options

> ? = optional

### Public

* returnTicker: `{}`
* return24Volume/return24hVolume: `{}`
* returnOrderBook: `{ currencyPair, depth? }`
* returnTradeHistory: `{ currencyPair, start?, end? }`
* returnChartData: `{ currencyPair, start, end, period }`
* returnCurrencies: `{}`
* returnLoanOrders: `{ currency }`

### Private

> `key` and `secret` are required in all

* returnBalances: `{}`
* returnCompleteBalances: `{}`
* returnDepositAddresses: `{}`
* generateNewAddress: `{ currency }`
* returnDepositsWithdrawals: `{ start, end }`
* returnOpenOrders: `{ currencyPair }`
* returnTradeHistory: `{ currencyPair, start?, end? }`
* returnOrderTrades: `{ orderNumber }`
* buy: `{ currencyPair, rate, amount, fillOrKill?, immediateOrCancel? }`
* sell: `{ currencyPair, rate, amount, fillOrKill?, immediateOrCancel? }`
* cancelOrder: `{ orderNumber }`
* moveOrder: `{ orderNumber, rate }`
* withdraw: `{ currency, amount, address, paymentId? }`
* returnAvailableAccountBalances: `{ account? }`
* returnTradableBalances: `{}`
* transferBalance: `{ currency, amount, fromAccount, toAccount }`
* returnMarginAccountSummary: `{}`
* marginBuy: `{ currencyPair, rate, amount, lendingRate? }`
* marginSell: `{ currencyPair, rate, amount, lendingRate? }`
* getMarginPosition: `{ currencyPair, type?, liquidationPrice? }`
* closeMarginPosition: `{ currencyPair }`
* createLoanOffer: `{ currency, amount, duration, autoRenew, lendingRate }`
* cancelLoanOffer: `{ orderNumber }`
* returnOpenLoanOffers: `{}`
* returnActiveLoans: `{}`
* toggleAutoRenew: `{ orderNumber }`

## License

```
(The MIT License)

Copyright (c) 2015 Ricardo Ferro <ricardo.ferro@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
