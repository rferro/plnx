
# plnx

Unofficial Poloniex API client, with public/private methods and push.

[![NPM](https://nodei.co/npm/plnx.png)](https://nodei.co/npm/plnx/)

## Install

```
npm install --save plnx
```

## Use

### Private/Public Methods

```
plnx.METHOD([options], callback);
```

* `options`: object (optional if empty)
* `callback`: function(err, data)

> With private methods, options.key and options.secret are required.

#### Example

```
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

```
plnx.push(function(session) {
  session.subscribe("channel", function(args, kwargs){
    console.log(args);
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

* returnBalances: `{}`
* returnCompleteBalances: `{}`
* returnDepositAddresses: `{}`
* generateNewAddress: `{ currency }`
* returnDepositsWithdrawals: `{ start, end }`
* returnOpenOrders: `{ currencyPair }`
* returnTradeHistory: `{ currencyPair, start?, end? }`
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

MIT
