#!/usr/bin/env node

import SocketClient from '../lib/socketClient';
// https://github.com/lukeed/kleur
const {
  red, yellow, green, blue,
} = require('kleur');

// PRISMA
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// TOOLS
const getDate = function () { return new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }); };
// let sleep = (ms) => new Promise (resolve => setTimeout (resolve, ms));

const saveToDB = async (
  price,
  quantity,
  quantityTotal,
  side,
  contractsPS,
  buyers,
  buyersPS,
  sellers,
  sellersPS,
  winner,
) => {
  const data = await prisma.tradeMINAUSDT.create({
    data: {
      price,
      quantity,
      quantityTotal,
      side,
      contractsPS,
      buyers,
      buyersPS,
      sellers,
      sellersPS,
      winner,
      createdAt: new Date(),
    },
  });
};

const tokenBase = 'usdt';
const tokenQuote = 'brl';
const pair = tokenBase + tokenQuote;
const streamName = `${pair}@trade`;

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
let contractsTotal = 0;
let contractsTotalPS = 0;
let contractsBuy = 0;
let contractsBuyPS = 0;
let contractsSellers = 0;
let contractsSellersPS = 0;

let winner = 0;
const buyersPerSecond = 0;
const sellersPerSecond = 0;

const measurePerSecond = function (timeStart, timeEnd, qtd) {
  const seconds = Math.abs(timeStart.getTime() - timeEnd.getTime()) / 1000;
  return (qtd / seconds).toFixed(4);
};

const socketClient = new SocketClient(`ws/${streamName}`, 'wss://stream.binance.com:9443/');

;(async function main () {

    socketClient.setHandler('trade', async (params) => {
      const current = +new Date();
      const eventTime = params.e;
      const price = parseFloat(params.p);
      const quantity = parseFloat(params.q);
      const side = params.m ? 'sell' : 'buy';

      if (quantity > 0) {
        if (side === 'buy') {
          contractsBuy += quantity;
        } else {
          contractsSellers += quantity;
        }
        contractsBuyPS = measurePerSecond(startTime, new Date(), contractsBuy);
        contractsSellersPS = measurePerSecond(startTime, new Date(), contractsSellers);

        contractsTotal += quantity;
        contractsTotalPS = measurePerSecond(startTime, new Date(), contractsTotal);
        winner = contractsBuyPS - contractsSellersPS; // buyers > 0 sellers < 0

        // await saveToDB(price,quantity,contractsTotal,side,contractsTotalPS,contractsBuy,contractsBuyPS,contractsSellers,contractsSellersPS,winner);
        console.log(`[${streamName}] ${getDate()} - ${blue(`price:${price.toFixed(3)}`)} | quantity:${quantity}/${contractsTotal.toFixed(0)}| side:${side} | ${yellow(`ContractsPS:${contractsTotalPS}`)}${green(` | Buyers:${contractsBuy.toFixed(2)}`)}${red(` Sellers:${contractsSellers.toFixed(2)}`)}${green(`| PS:${contractsBuyPS}`)}${red(` PS:${contractsSellersPS}`)} winner:${winner.toFixed(2)}`);
      }
    });
    
} ())

