#!/usr/bin/env node

import SocketClient from '../lib/socketClient';
// https://github.com/lukeed/kleur
const { red, yellow, green, blue } = require('kleur');

// TOOLS
let getDate = function(){ return new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"}) }
// let sleep = (ms) => new Promise (resolve => setTimeout (resolve, ms));

const tokenBase = 'sol';
const tokenQuote = 'usdt';
const pair = tokenBase + tokenQuote;
const streamName = pair + '@trade';

// PAYLOAD
// {
//   "e": "trade",       // Event type
//   "E": 1672515782136, // Event time
//   "s": "BNBBTC",      // Symbol
//   "t": 12345,         // Trade ID
//   "p": "0.001",       // Price
//   "q": "100",         // Quantity
//   "b": 88,            // Buyer order ID
//   "a": 50,            // Seller order ID
//   "T": 1672515782136, // Trade time
//   "m": true,          // Is the buyer the market maker?
//   "M": true           // Ignore
// }
const startTime = new Date();
let contractsTotal   = 0;
let contractsTotalPS = 0;
let contractsBuy     = 0;
let contractsBuyPS   = 0;
let contractsSellers = 0;
let contractsSellersPS = 0;

let winner = 0;
let buyersPerSecond = 0;
let sellersPerSecond = 0;

let measurePerSecond = function(timeStart, timeEnd, qtd) {
  const seconds = Math.abs(timeStart.getTime() - timeEnd.getTime()) / 1000;
  return (qtd / seconds).toFixed(2);
};

const socketClient = new SocketClient(`ws/${streamName}`, 'wss://stream.binance.com:9443/');
socketClient.setHandler('trade', (params) => {
  
  const current = +new Date();
  const eventTime = params.e;
  const price = parseFloat(params.p);
  const quantity = parseFloat(params.q);
  const side = params.m ? 'sell' : 'buy';

  if (side === 'buy') {
    contractsBuy += quantity;
    // buyersPerSecond += parseInt(tradesPerSecond(startTime, new Date(), quantity));
  } else {
    contractsSellers += quantity;
  }
  contractsBuyPS = measurePerSecond(startTime, new Date(), contractsBuy);
  contractsSellersPS = measurePerSecond(startTime, new Date(), contractsSellers);

  contractsTotal += quantity;
  contractsTotalPS = measurePerSecond(startTime, new Date(), contractsTotal);
  winner = contractsBuyPS - contractsSellersPS; // buyers > 0 sellers < 0


  // const TvsNow = current - params.T;
  // const EvsNow = current - params.E;
  // const EvsT = params.E - params.T;
  // console.log(`[Spot ${streamName}] current:${current} delta TvsNow: ${TvsNow}, EvsNow: ${EvsNow}, EvsT: ${EvsT}`);
  // console.log(`[${streamName}] ${getDate()} - price:${price} | quantity:${quantity}/${trades.toFixed(2)}| side:${side} trdPS: ${tradesPerSecond(startTime, new Date(), trades)} winner:${winner.toFixed(0)} buyPS: ${buyersPerSecond} sellPS: ${sellersPerSecond}`);
  console.log('['+streamName+'] '+getDate()+' - '+blue('price:'+price.toFixed(3))+' | quantity:'+quantity+'/'+contractsTotal.toFixed(0)+'| side:'+side+' | '+yellow('ContractsPS:'+contractsTotalPS)+green(' | Buyers:'+contractsBuy.toFixed(0))+red(' Sellers:'+contractsSellers.toFixed(0))+green('| PS:'+contractsBuyPS)+red(' PS:'+contractsSellersPS)+' winner:'+winner.toFixed(0));
});
