const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { analyse } = require('../modules/accounts');
const { wallet: walletLib } = require('multi-nano-web');
const { saveTransaction, getCurrentCycle, createAccount, changeAccountStatus, getAccountStatus, saveSeed } = require('../modules/db');

// Configs
const serverConf = require('../config/server.json');
const port = serverConf['httPort'];

app.use(bodyParser.json());

function isNanoAddress(address) {
    // Expression régulière pour valider le format de l'adresse Nano
    const regex = /^(xrb|nano)_[13][13456789abcdefghijkmnopqrstuwxyz]{59}$/i;
    return regex.test(address);
}

app.post('/create', async (req, res) => {
    const data = req.body;
    console.log('Données reçues :', data);
  
    if (data.to && data.cycles && data.decalage >= 0) {
      // Vérifier si data.to est une adresse Nano valide
      const nanoAddressRegex = /^(nano|xrb)_[13]{1}[13456789abcdefghijkmnopqrstuwxyz]{59}$/i;
      if (!nanoAddressRegex.test(data.to)) {
        console.error('Adresse Nano invalide');
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
        console.log(result);
  
        if (result.status == 'ok') {
          changeAccountStatus(wallet.accounts[0].address);
          const currentCycle = await getCurrentCycle();
  
          for (let i = 0; i < data.cycles; i++) {
            const dividedNumber = result.data / data.cycles;
            const randomPercentage = Math.random() * (0.05 - 0.001) + 0.001; // Génère un pourcentage aléatoire entre 0.1% et 5%
            const deductedNumber = Math.floor(dividedNumber * (1 - randomPercentage))
              .toLocaleString(undefined, { maximumFractionDigits: 0 })
              .replace(/,/g, ''); // Effectue la déduction
  
            const cycle = currentCycle + data.decalage + i;
            await saveTransaction(data.to, deductedNumber, cycle);
          }
        }
      } catch (error) {
        console.error(error);
        console.log('{ "status": "error" }');
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
  

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
