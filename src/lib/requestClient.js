import crypto from 'crypto';
import getRequestInstance from './helpers/getRequestInstance';

const publicRequest = () => getRequestInstance({
  headers: {
    'content-type': 'application/json',
  },
});

const spotPublicRequest = () => getRequestInstance({
  baseURL: 'https://api.binance.com',
  headers: {
    'content-type': 'application/json',
  },
});


const buildQueryString = (q) => (q ? `?${Object.keys(q)
  .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(q[k])}`)
  .join('&')}` : '');

const privateRequest = (apiKey, apiSecret, baseURL) => (
  method = 'GET',
  path,
  data = {},
) => {
  if (!apiKey) {
    throw new Error('API key is missing');
  }

  if (!apiSecret) {
    throw new Error('API secret is missing');
  }

  const timestamp = Date.now();

  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(buildQueryString({ ...data, timestamp }).substr(1))
    .digest('hex');

  return getRequestInstance({
    baseURL,
    headers: {
      'content-type': 'application/json',
      'X-MBX-APIKEY': apiKey,
    },
    method,
    url: path,
  });
};

const publicDataRequest = (apiKey, baseURL) => (
  method = 'GET',
  path,
  data = {},
) => {
  if (!apiKey) {
    throw new Error('API key is missing');
  }

  return getRequestInstance({
    baseURL,
    headers: {
      'content-type': 'application/json',
      'X-MBX-APIKEY': apiKey,
    },
    method,
    url: path,
  });
};

const spotMarketDataRequest = (apiKey, baseURL = 'https://api.binance.com') => publicDataRequest(apiKey, baseURL);
const spotPrivateRequest = (apiKey, apiSecret, baseURL = 'https://api.binance.com') => privateRequest(apiKey, apiSecret, baseURL);
const futuresPrivateRequest = (apiKey, apiSecret, baseURL = 'https://fapi.binance.com') => privateRequest(apiKey, apiSecret, baseURL);

const deliveryFuturesPrivateRequest = (apiKey, apiSecret, testnet) => {
  let baseURL = 'https://dapi.binance.com';
  if (testnet) {
    baseURL = 'https://testnet.binancefuture.com';
  }
  return privateRequest(apiKey, apiSecret, baseURL);
};

export {
  spotPublicRequest,
  publicRequest,
  privateRequest,
  spotPrivateRequest,
  spotMarketDataRequest,
  futuresPrivateRequest,
  deliveryFuturesPrivateRequest,
};
