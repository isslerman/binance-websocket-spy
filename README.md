# Binance Websocket Examples

## Local orderbook (Spot)

```bash
# Cache local orderbook and echo best price
# btcusdt by default
npm run orderbook

# or provide the trading pair
SYMBOL=bnbusdt npm run orderbook

```

## Spot user data stream

```bash
# get user data steam
APIKEY=xxxxxx npm run user

# Get margin account update from websocket
APIKEY=xxxxxx APISECRET=xxxxx npm run margin-user
```

## Futures user data stream

```bash
# Get user data steam on production
APIKEY=xxxxxx APISECRET=xxxxx npm run futures-user

# On testnet
APIKEY=xxxxxx APISECRET=xxxxx WSS_BASE_URL="wss://stream.binancefuture.com/" HTTP_BASE_URL="https://testnet.binancefuture.com/" npm run futures-user
```

## Delivery Futures user data stream

```bash
# Get user data steam - defaults to production
APIKEY=xxxxxx APISECRET=xxxxx npm run delivery-futures-user
```

## Combined streams

```bash
# Get multi pairs stream, setting the pairs in src/multi-stream-depth
npm run multi-stream
```

## Spot trade stream delay monitoring

```bash
npm run monitor-spot-trade
```

## Spot depth stream delay monitoring

```bash
npm run monitor-spot-depth
```

## Futures depth stream delay monitoring

```bash
npm run monitor-futures
```

## How to setup

```bash

npm install

# run test
npm run test

```

## Modifications
I have forked this project from another project called binance websocket (need to get the URL), and have done some modification. 
Using the websocket in realtime, I'm doing some math to pre calculate how many contracts are being buyed, selled and the winner. 
All the data is pushed to a DB (you can configure in .env).
I have added the prisma orm to deal with the DB. 

```bash
# run ethusdt
npm run monitor-spot-trade-ethusdt
# run minausdt
npm run monitor-spot-trade-minausdt

```


## License
MIT
