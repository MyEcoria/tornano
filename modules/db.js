const mongoose = require('mongoose');

// Config
const dbConf = require('../config/db.json');

// URL de connexion à la base de données MongoDB
const dbURL = dbConf['url'];

// Schéma de la transaction
const transactionSchema = new mongoose.Schema({
  to: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  cycle: {
    type: Number,
    required: true
  }
});

// Schéma pour les dépôts
const depositSchema = new mongoose.Schema({
  depositAddress: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  cycles: {
    type: Number,
    required: true
  },
  decalage: {
    type: Number,
    required: true
  }
});

// Schéma pour les informations
const informationSchema = new mongoose.Schema({
  currentCycle: {
    type: Number,
    required: true
  },
  totalMixed: {
    type: Number,
    required: true
  }
});

// Schéma pour les seeds
const seedSchema = new mongoose.Schema({
  seed: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

// Schéma pour les comptes
const accountSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: false
  }
});

// Définition des modèles basés sur les schémas
const Transaction = mongoose.model('Transaction', transactionSchema);
const Deposit = mongoose.model('Deposit', depositSchema);
const Information = mongoose.model('Information', informationSchema);
const Seed = mongoose.model('Seed', seedSchema);
const Account = mongoose.model('Account', accountSchema);

// Connexion à la base de données MongoDB
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 60000,
  wtimeout: 60000
})
  .then(() => {
    const dbName = new URL(dbURL).pathname.substr(1);
    const db = mongoose.connection.db;

    return db.admin().listDatabases({ nameOnly: true })
      .then(databases => {
        const dbExists = databases.databases.some(db => db.name === dbName);
        if (!dbExists) {
          return Promise.all([
            db.createCollection('transactions'),
            db.createCollection('deposits'),
            db.createCollection('informations'),
            db.createCollection('seeds'),
            db.createCollection('accounts')
          ])
            .then(() => {
              console.log(`La base de données "${dbName}" a été créée avec succès.`);
            });
        }
      });
  })
  .catch(error => {
    console.error('Erreur lors de la connexion à la base de données MongoDB:', error);
  });

// Fonction pour enregistrer une transaction
async function saveTransaction(to, amount, cycle) {
  try {
    const transaction = new Transaction({
      to,
      amount,
      cycle
    });

    await transaction.save();
    console.log('Transaction enregistrée avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la transaction:', error);
  }
}

// Fonction pour enregistrer un dépôt
async function saveDeposit(depositAddress, to, cycles, decalage) {
  try {
    const deposit = new Deposit({
      depositAddress,
      to,
      cycles,
      decalage
    });

    await deposit.save();
    console.log('Dépôt enregistré avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du dépôt:', error);
  }
}

// Fonction pour enregistrer des informations
async function saveInformation(currentCycle, totalMixed) {
  try {
    const information = new Information({
      currentCycle,
      totalMixed
    });

    await information.save();
    console.log('Informations enregistrées avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des informations:', error);
  }
}

// Fonction pour enregistrer une seed
async function saveSeed(seed) {
  try {
    const date = new Date();
    const seedData = new Seed({
      seed,
      date
    });

    await seedData.save();
    console.log('Seed enregistrée avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la seed:', error);
  }
}

// Fonction pour créer un compte
async function createAccount(address) {
  try {
    const account = new Account({
      address
    });

    await account.save();
    console.log('Compte créé avec succès.');
  } catch (error) {
    console.error('Erreur lors de la création du compte:', error);
  }
}

// Fonction pour changer le statut d'un compte de false à true
async function changeAccountStatus(address) {
  try {
    await Account.updateOne({ address }, { status: true });
    console.log('Statut du compte mis à jour avec succès.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut du compte:', error);
  }
}

// Fonction pour récupérer le statut d'un compte
async function getAccountStatus(address) {
  try {
    const account = await Account.findOne({ address });
    if (account) {
      return account.status;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du statut du compte:', error);
    return null;
  }
}

// Fonction pour ajouter 1 au cycle des informations
async function addCycle() {
  try {
    const information = await Information.findOne();
    if (information) {
      information.currentCycle += 1;
      await information.save();
      console.log('Cycle ajouté avec succès.');
    } else {
      console.error('Aucune information trouvée.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout du cycle:', error);
  }
}

// Fonction pour récupérer le cycle actuel
async function getCurrentCycle() {
  try {
    const information = await Information.findOne();
    if (information) {
      return information.currentCycle;
    } else {
      console.error('Aucune information trouvée.');
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du cycle:', error);
    return null;
  }
}

// Fonction pour obtenir toutes les transactions d'un cycle spécifique
async function getAllTransaction(cycle) {
  try {
    const transactions = await Transaction.find({ cycle });
    return transactions;
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
    return null;
  }
}

// Exporter les fonctions pour les rendre disponibles dans d'autres modules
module.exports = {
  saveTransaction,
  saveDeposit,
  saveInformation,
  saveSeed,
  createAccount,
  changeAccountStatus,
  getAccountStatus,
  addCycle,
  getCurrentCycle,
  getAllTransaction,
};
