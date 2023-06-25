const schedule = require('node-schedule');
const {
  getCurrentCycle,
  getAllTransaction,
  addCycle
} = require('../modules/db.js');

const { send } = require('../modules/send.js');

function runCode() {
  getCurrentCycle()
    .then(async (currentCycle) => {
      const transactions = await getAllTransaction(currentCycle);

      for (const transaction of transactions) {
        const { to, amount } = transaction;
        await send(to, amount);
      }

      await addCycle();
      console.log('Les transactions ont été envoyées et le cycle a été mis à jour.');
    })
    .catch((error) => {
      console.error('Une erreur s\'est produite :', error);
    });
}

// Planifier l'exécution du code tous les jours à 13h00
const job = schedule.scheduleJob('0 13 * * *', runCode);