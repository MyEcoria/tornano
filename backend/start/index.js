const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { analyse } = require('../modules/accounts');
const { wallet: walletLib } = require('multi-nano-web');
const { saveTransaction, getCurrentCycle, createAccount, changeAccountStatus, getAccountStatus, saveSeed } = require('../modules/db');
const cors = require('cors');
const cliProgress = require('cli-progress');
const { send, sendSecond, sendFaucet } = require('../modules/send');
const rateLimit = require('express-rate-limit');

// Configs
const serverConf = require('../config/server.json');
const port = serverConf['httPort'];

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 300, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const faucetLimiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Définir le middleware pour servir les fichiers statiques
app.use(express.static('web'));
app.use(bodyParser.json());
app.use(cors());

function isNanoAddress(address) {
  // Expression régulière pour valider le format de l'adresse Nano
  const regex = /^(xrb|nano)_[13][13456789abcdefghijkmnopqrstuwxyz]{59}$/i;
  return regex.test(address);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.post('/create', limiter, async (req, res) => {
  const data = req.body;

  if (data.type == 1){
    if (data.to && data.cycles && data.decalage >= 0) {
      // Vérifier si data.to est une adresse Nano valide
      const nanoAddressRegex = /^(nano|xrb)_[13]{1}[13456789abcdefghijkmnopqrstuwxyz]{59}$/i;
      if (!nanoAddressRegex.test(data.to)) {
        return res.status(400).json({ error: 'Adresse Nano invalide' });
      }
  
      let seed = walletLib.generateLegacy().seed;
      saveSeed(seed);
      const wallet = walletLib.fromLegacySeed(seed);
      // Traitez les données comme vous le souhaitez
      res.status(200).json({ deposit: wallet.accounts[0].address });
      createAccount(wallet.accounts[0].address);
  
      try {
        const result = await analyse(seed, 7200000);
        if (result.status == 'ok') {
          changeAccountStatus(wallet.accounts[0].address);
          const currentCycle = await getCurrentCycle();
  
          const progressBar = new cliProgress.SingleBar({
            format: 'Progress |{bar}| {percentage}% | ETA: {eta_formatted} | {value}/{total}',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
          });
  
          progressBar.start(data.cycles, 0);
  
          for (let i = 0; i < data.cycles; i++) {
            const dividedNumber = result.data / data.cycles;
            const randomPercentage = Math.random() * (0.05 - 0.001) + 0.001; // Génère un pourcentage aléatoire entre 0.1% et 5%
            const deductedNumber = Math.floor(dividedNumber * (1 - randomPercentage))
              .toLocaleString(undefined, { maximumFractionDigits: 0 })
              .replace(/,/g, ''); // Effectue la déduction
  
            const cycle = currentCycle + data.decalage + i;
            await saveTransaction(data.to, deductedNumber, cycle);
  
            progressBar.increment();
          }
  
          progressBar.stop();
        }
      } catch (error) {
        console.log('{ "status": "error" }');
      }
    }
  } else if (data.type == 2) {
    if (data.to) {
      const nanoAddressRegex = /^(nano|xrb)_[13]{1}[13456789abcdefghijkmnopqrstuwxyz]{59}$/i;
      if (!nanoAddressRegex.test(data.to)) {
        return res.status(400).json({ error: 'Adresse Nano invalide' });
      }
      let seed = walletLib.generateLegacy().seed;
      saveSeed(seed);
      const wallet = walletLib.fromLegacySeed(seed);
      // Traitez les données comme vous le souhaitez
      res.status(200).json({ deposit: wallet.accounts[0].address });
      createAccount(wallet.accounts[0].address);

      try {
        const result = await analyse(seed, 7200000);
        if (result.status == 'ok') {
          changeAccountStatus(wallet.accounts[0].address);
          await sendSecond(data.to, result.data);
        }
      } catch (error) {
        console.log('{ "status": "error" }');
      }
    }
  }
});

app.get('/faucet/:userId', faucetLimiter, async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);

  if (userId) {
      // Vérifier si userId est une adresse Nano valide
      const isValidAddress = await isNanoAddress(userId);

      if (isValidAddress) {
        const faucet = await sendFaucet(userId, '0.000001');
        console.log(faucet);
        res.send('{"status": "ok"}')
      } else {
        // L'adresse n'est pas valide, renvoyer une erreur ou une autre réponse appropriée
        res.status(400).send('Adresse Nano invalide');
      }
    }
  
});

app.get('/users/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Vérifier si userId est une adresse Nano valide
    const isValidAddress = await isNanoAddress(userId);

    if (isValidAddress) {
      const status = await getAccountStatus(userId);
      res.send(`{ "status": "${status}" }`);
    } else {
      // L'adresse n'est pas valide, renvoyer une erreur ou une autre réponse appropriée
      res.status(400).send('Adresse Nano invalide');
    }
  } catch (error) {
    // Gérer les erreurs de validation
    res.status(500).send('Erreur de validation de l\'adresse Nano');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${port}`);
});