"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  urls: {
    public: "https://poloniex.com/public",
    private: "https://poloniex.com/tradingApi",
    push: "wss://api.poloniex.com"
  },
  commands: {
    returnTicker: {
      type: "public",
      params: []
    },
    return24hVolume: {
      type: "public",
      params: []
    },
    returnOrderBook: {
      type: "public",
      params: ["currencyPair", "depth?"]
    },
    returnChartData: {
      type: "public",
      params: ["currencyPair", "start", "end", "period"]
    },
    returnCurrencies: {
      type: "public",
      params: []
    },
    returnLoanOrders: {
      type: "public",
      params: ["currency"]
    },
    returnBalances: {
      type: "private",
      params: []
    },
    returnCompleteBalances: {
      type: "private",
      params: []
    },
    returnDepositAddresses: {
      type: "private",
      params: []
    },
    generateNewAddress: {
      type: "private",
      params: ["currency"]
    },
    returnDepositsWithdrawals: {
      type: "private",
      params: ["start", "end"]
    },
    returnOpenOrders: {
      type: "private",
      params: ["currencyPair"]
    },
    buy: {
      type: "private",
      params: ["currencyPair", "rate", "amount", "fillOrKill?", "immediateOrCancel?"]
    },
    sell: {
      type: "private",
      params: ["currencyPair", "rate", "amount", "fillOrKill?", "immediateOrCancel?"]
    },
    cancelOrder: {
      type: "private",
      params: ["orderNumber"]
    },
    moveOrder: {
      type: "private",
      params: ["orderNumber", "rate"]
    },
    withdraw: {
      type: "private",
      params: ["currency", "amount", "address", "paymentId?"]
    },
    returnAvailableAccountBalances: {
      type: "private",
      params: ["account?"]
    },
    returnTradableBalances: {
      type: "private",
      params: []
    },
    transferBalance: {
      type: "private",
      params: ["currency", "amount", "fromAccount", "toAccount"]
    },
    returnMarginAccountSummary: {
      type: "private",
      params: []
    },
    marginBuy: {
      type: "private",
      params: ["currencyPair", "rate", "amount", "lendingRate?"]
    },
    marginSell: {
      type: "private",
      params: ["currencyPair", "rate", "amount", "lendingRate?"]
    },
    getMarginPosition: {
      type: "private",
      params: ["currencyPair", "type?", "liquidationPrice?"]
    },
    closeMarginPosition: {
      type: "private",
      params: ["currencyPair"]
    },
    createLoanOffer: {
      type: "private",
      params: ["currency", "amount", "duration", "autoRenew", "lendingRate"]
    },
    cancelLoanOffer: {
      type: "private",
      params: ["orderNumber"]
    },
    returnOpenLoanOffers: {
      type: "private",
      params: []
    },
    returnActiveLoans: {
      type: "private",
      params: []
    },
    toggleAutoRenew: {
      type: "private",
      params: ["orderNumber"]
    },
    returnTradeHistory: {
      type: "both",
      params: {
        private: ["currencyPair", "start?", "end?"],
        public: ["currencyPair", "start?", "end?"]
      }
    }
  }
};