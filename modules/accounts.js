const { Wallet } = require('simple-nano-wallet-js');
const { wallet: walletLib } = require('multi-nano-web');
const WebSocket = require('ws');

// import config
const nanswap = require('../config/nanswap.json');
const general = require('../config/general.json');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function analyse(seed, timeout) {
  return new Promise((resolve, reject) => {
    console.log(seed);

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

    let accounts = wallet.createAccounts(0);
    console.log(accounts);

    const ws = new WebSocket(`wss://nodes.nanswap.com/ws/?ticker=${ticker}&api=${key}`);

    let timeoutId;

    function handleTimeout() {
      console.log(`Temps d'attente maximum atteint (${timeout} ms)`);
      ws.close();
      reject({ status: "error" });
    }

    ws.on('open', () => {
      console.log('WebSocket connection established');
      timeoutId = setTimeout(handleTimeout, timeout);

      // Envoyer la demande de suivi pour le compte spécifié
      const subscribeMsg = JSON.stringify({
        action: 'subscribe',
        topic: 'confirmation',
        options: {
          accounts: [accounts[0]],
        },
      });
      ws.send(subscribeMsg);
    });

    ws.on('message', async (data) => {
      const message = JSON.parse(data);

      if (message.topic === 'confirmation' && message.message.block.subtype === "send") {
        clearTimeout(timeoutId);
        const account = message.message.account;
        const amount = message.message.amount;
        console.log(`Nouvelle transaction reçue sur le compte ${account}: ${amount} Nano`);

        // Fonction pour envoyer une transaction
        async function send(source, amount) {
          await sleep(1000); // Pause d'une seconde (1000 millisecondes)
          let hash = await wallet.send({
            source: source,
            destination: general['principalAccount'],
            amount: amount,
          });
          console.log(hash);
        }

        await send(accounts[0], amount);
        ws.close();
        resolve({ status: "ok", data: amount });

        // Effectuez d'autres actions avec la transaction, par exemple déclencher une action ou envoyer une notification
      }
    });

    ws.on('error', (error) => {
      clearTimeout(timeoutId);
      console.error('WebSocket error:', error);
      ws.close();
      reject({ status: "error" });
    });
  });
}

module.exports = { analyse };