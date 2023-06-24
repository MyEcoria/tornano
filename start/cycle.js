const cron = require('node-cron');
const {
  getCurrentCycle,
  getAllTransaction,
  addCycle
} = require('../modules/db.js');

const { send } = require('../modules/send.js');

// Exécuter le code tous les jours à 13h06
cron.schedule('9 13 * * *', async () => {
  try {
    const currentCycle = await getCurrentCycle();
    const transactions = await getAllTransaction(currentCycle);

    for (const transaction of transactions) {
      const { to, amount } = transaction;
      await send(to, amount);
    }

    await addCycle();
    console.log('Les transactions ont été envoyées et le cycle a été mis à jour.');
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
  }
});