const { Wallet } = require('simple-nano-wallet-js');
const { wallet: walletLib } = require('multi-nano-web');

// config file
const general = require('../config/general.json');
const nanswap = require('../config/nanswap.json');
let key = nanswap['apiKey']; // Ta clé API Nanswap Nodes, https://nanswap.com/nodes

let ticker = "XNO";
let headerAuth = { // En-tête personnalisé pour l'authentification
  "nodes-api-key": key
};
let baseConfig = {
      RPC_URL: `https://nodes.nanswap.com/${ticker}`,
      WORK_URL: `https://nodes.nanswap.com/${ticker}`,
      WS_URL: `wss://nodes.nanswap.com/ws/?ticker=${ticker}&api=${key}`,
      customHeaders: headerAuth,
      prefix: 'nano_',
      decimal: 30,
      wsSubAll: false,
      defaultRep: "nano_1banexkcfuieufzxksfrxqf6xy8e57ry1zdtq9yn7jntzhpwu4pg4hajojmq",
    }

const wallets = {
  "principalSeed": new Wallet(Object.assign({}, baseConfig, {seed: general['principalSeed']})), // add the custom seed to conf object
  "secondSeed": new Wallet(Object.assign({}, baseConfig, {seed: general['secondSeed']})), 
  "faucetSeed": new Wallet(Object.assign({}, baseConfig, {seed: general['faucetSeed']}))
  
}  

async function receive() {
  try {
    let seed = general['principalSeed']; // save & backup it somewhere!
    // initialize wallet
    let wallet = wallets['principalSeed]

    // Generate 10 derived accounts
    let accounts = wallet.createAccounts(0);
    console.log(accounts);
    // ["nano_3g5hpb4kwqgakt4cx11ftq6xztx1matfhgkmhunj3sx4f4s3nwb6hfi3nts1", ... ]

    // receive all receivable blocks for an account
    let hashesReceive = await wallet.receiveAll(general['principalAccount']);
    console.log(hashesReceive);
  } catch (error) {
    console.error('Une erreur s est produite:', error);
  }
}

async function receiveSecond() {
  try {
    // initialize wallet
    let wallet = wallets['secondSeed]
    // Generate 10 derived accounts
    let accounts = wallet.createAccounts(0);
    console.log(accounts);
    // ["nano_3g5hpb4kwqgakt4cx11ftq6xztx1matfhgkmhunj3sx4f4s3nwb6hfi3nts1", ... ]

    // receive all receivable blocks for an account
    let hashesReceive = await wallet.receiveAll(general['secondAccount']);
    console.log(hashesReceive);
  } catch (error) {
    console.error('Une erreur s est produite:', error);
  }
}

async function receiveFaucet() {
  try {
    let wallet = wallets['faucetSeed]
    // Generate 10 derived accounts
    let accounts = wallet.createAccounts(0);
    console.log(accounts);
    // ["nano_3g5hpb4kwqgakt4cx11ftq6xztx1matfhgkmhunj3sx4f4s3nwb6hfi3nts1", ... ]

    // receive all receivable blocks for an account
    let hashesReceive = await wallet.receiveAll(general['faucetAccount']);
    console.log(hashesReceive);
  } catch (error) {
    console.error('Une erreur s est produite:', error);
  }
}

// Exécuter la fonction receive() immédiatement
receive();
receiveSecond();
receiveFaucet();

// Exécuter la fonction receive() toutes les 5 minutes
setInterval(receive, 5 * 60 * 1000);
setInterval(receiveSecond, 5 * 60 * 1000);
setInterval(receiveFaucet, 5 * 60 * 1000);
