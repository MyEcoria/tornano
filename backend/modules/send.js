const { Wallet } = require('simple-nano-wallet-js');
const { wallet: walletLib} = require('multi-nano-web')

// config files
const general = require('../config/general.json');
const nanswap = require('../config/nanswap.json');

// initialize wallet
let key = nanswap['apiKey']; // Ta clé API Nanswap Nodes, https://nanswap.com/nodes

let ticker = "XNO";
let headerAuth = { // En-tête personnalisé pour l'authentification
    "nodes-api-key": key
};

async function send(to, amount) {
        const wallet = new Wallet({
          RPC_URL: `https://nodes.nanswap.com/${ticker}`,
          WORK_URL: `https://nodes.nanswap.com/${ticker}`,
          WS_URL: `wss://nodes.nanswap.com/ws/?ticker=${ticker}&api=${key}`,
          seed: general['principalSeed'],
          customHeaders: headerAuth,
          prefix: 'nano_',
          decimal: 30,
          wsSubAll: false,
          defaultRep: "nano_1banexkcfuieufzxksfrxqf6xy8e57ry1zdtq9yn7jntzhpwu4pg4hajojmq",
        });
        // Convertir l'amount en nombre
        const amountNumber = parseFloat(amount);
      
        // Vérifier si amountNumber est un nombre valide
        if (isNaN(amountNumber)) {
          console.error('Le montant spécifié n\'est pas un nombre valide.');
          return;
        }
        let accounts = wallet.createAccounts(0);
        let hash = await wallet.send({
          source: accounts[0],
          destination: to,
          amount: amountNumber,
        });
        return(hash);
}

async function sendSecond(to, amount) {
  const wallet = new Wallet({
    RPC_URL: `https://nodes.nanswap.com/${ticker}`,
    WORK_URL: `https://nodes.nanswap.com/${ticker}`,
    WS_URL: `wss://nodes.nanswap.com/ws/?ticker=${ticker}&api=${key}`,
    seed: general['secondSeed'],
    customHeaders: headerAuth,
    prefix: 'nano_',
    decimal: 30,
    wsSubAll: false,
    defaultRep: "nano_1banexkcfuieufzxksfrxqf6xy8e57ry1zdtq9yn7jntzhpwu4pg4hajojmq",
  });
  // Convertir l'amount en nombre
  const amountNumber = parseFloat(amount);

  // Vérifier si amountNumber est un nombre valide
  if (isNaN(amountNumber)) {
    console.error('Le montant spécifié n\'est pas un nombre valide.');
    return;
  }
  let accounts = wallet.createAccounts(0);
  let hash = await wallet.send({
    source: accounts[0],
    destination: to,
    amount: amountNumber,
  });
  return(hash);
}

async function sendFaucet(to, amount) {
  const wallet = new Wallet({
    RPC_URL: `https://nodes.nanswap.com/${ticker}`,
    WORK_URL: `https://nodes.nanswap.com/${ticker}`,
    WS_URL: `wss://nodes.nanswap.com/ws/?ticker=${ticker}&api=${key}`,
    seed: general['faucetSeed'],
    customHeaders: headerAuth,
    prefix: 'nano_',
    decimal: 30,
    wsSubAll: false,
    defaultRep: "nano_1banexkcfuieufzxksfrxqf6xy8e57ry1zdtq9yn7jntzhpwu4pg4hajojmq",
  });
  // Convertir l'amount en nombre
  const amountNumber = parseFloat(amount);

  // Vérifier si amountNumber est un nombre valide
  if (isNaN(amountNumber)) {
    console.error('Le montant spécifié n\'est pas un nombre valide.');
    return;
  }
  let accounts = wallet.createAccounts(0);
  let hash = await wallet.send({
    source: accounts[0],
    destination: to,
    amount: wallet.megaToRaw(amountNumber),
  });
  return(hash);
}

module.exports = { 
  send,
  sendSecond,
  sendFaucet
};
      