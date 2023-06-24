const { Wallet } = require('simple-nano-wallet-js');
const { wallet: walletLib} = require('multi-nano-web')

// config files
const general = require('../config/general.json');
const nanswap = require('../config/nanswap.json');

let seed = general['principalSeed']; // save & backup it somewhere!
// initialize wallet
let key = nanswap['apiKey']; // Ta clé API Nanswap Nodes, https://nanswap.com/nodes

let ticker = "XNO";
let headerAuth = { // En-tête personnalisé pour l'authentification
    "nodes-api-key": key
};

const wallet = new Wallet({
      RPC_URL: `https://nodes.nanswap.com/${ticker}`,
      WORK_URL: `https://nodes.nanswap.com/${ticker}`,
      WS_URL: `wss://nodes.nanswap.com/ws/?ticker=${ticker}&api=${key}`,
      seed: seed,
      customHeaders: headerAuth,
      prefix: 'nano_',
      decimal: 30,
      wsSubAll: false,
      defaultRep: "nano_1banexkcfuieufzxksfrxqf6xy8e57ry1zdtq9yn7jntzhpwu4pg4hajojmq",
    });

async function send(to, amount) {
        // Convertir l'amount en nombre
        const amountNumber = parseFloat(amount);
      
        // Vérifier si amountNumber est un nombre valide
        if (isNaN(amountNumber)) {
          console.error('Le montant spécifié n\'est pas un nombre valide.');
          return;
        }
        let accounts = wallet.createAccounts(0);
        // Envoyer 0.001 nano depuis general['principalAccount'] vers to
        let hash = await wallet.send({
          source: accounts[0],
          destination: to,
          amount: amountNumber,
        });
        return(hash);
        // Suite du code...
}

module.exports = { send };
      