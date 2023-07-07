const { Wallet } = require('simple-nano-wallet-js-dev');
const { wallet: walletLib } = require('multi-nano-web');
const WebSocket = require('ws');
const cliProgress = require('cli-progress');

// import config
const nanswap = require('../config/nanswap.json');
const general = require('../config/general.json');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function analyse(seed, timeout) {
  return new Promise(async (resolve, reject) => {
    const apiKey = nanswap['apiKey'];
    const ticker = "XNO";
    const headerAuth = {
      "nodes-api-key": apiKey
    };

    const wallet = new Wallet({
      RPC_URL: `https://nodes.nanswap.com/${ticker}`,
      WORK_URL: `https://nodes.nanswap.com/${ticker}`,
      WS_URL: `wss://nodes.nanswap.com/ws/?ticker=${ticker}&api=${apiKey}`,
      seed: seed,
      customHeaders: headerAuth,
      prefix: 'nano_',
      decimal: 30,
      wsSubAll: false,
      defaultRep: "nano_1banexkcfuieufzxksfrxqf6xy8e57ry1zdtq9yn7jntzhpwu4pg4hajojmq",
      connectionTimeout: timeout,
    });

    let accounts = wallet.createAccounts(0);
    const ws = new WebSocket(`wss://nodes.nanswap.com/ws/?ticker=${ticker}&api=${apiKey}`);

    ws.on('open', () => {
      const progressBar = new cliProgress.SingleBar({
        format: 'Progress |{bar}| {percentage}% | ETA: {eta_formatted} | {value}/{total}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
      });

      console.log(`[Analyse: ${accounts[0]}]`);
      progressBar.start(100, 0);

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
        const account = message.message.account;
        const amount = message.message.amount;

        const progressBar = new cliProgress.SingleBar({
          format: 'Progress |{bar}| {percentage}% | ETA: {eta_formatted} | {value}/{total}',
          barCompleteChar: '\u2588',
          barIncompleteChar: '\u2591',
          hideCursor: true
        });

        async function send(source, amount) {
          let progress = 0;
          progressBar.start(100, progress);

          while (progress < 100) {
            await sleep(100);
            progress += 10;
            progressBar.update(progress);
          }

          let hash;
          try {
            hash = await wallet.send({
              source: source,
              destination: general['principalAccount'],
              amount: amount,
            });
          } catch (error) {
            progressBar.stop();
            reject({ status: "error", error: error });
            return;
          }

          progressBar.stop();
          resolve({ status: "ok", data: amount });
        }

        try {
          await send(accounts[0], amount);
          ws.close();
        } catch (error) {
          ws.close();
          reject({ status: "error", error: error });
        }
      }
    });

    ws.on('error', (error) => {
      reject({ status: "error", error: error });
    });

    ws.on('close', () => {
      reject({ status: "error", error: "WebSocket connection closed" });
    });

    setTimeout(() => {
      ws.close();
      reject({ status: "error", error: "Temps d'attente maximum atteint" });
    }, timeout);
  });
}

module.exports = { analyse };