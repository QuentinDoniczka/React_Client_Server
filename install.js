// importer le module sqlite3
const sqlite3 = require('sqlite3').verbose();
// importer le fichier JSON contenant les données de produits
const PRODUCTS = require('./products.json');

// nom du fichier de la base de données SQLite
const DB_FILE = 'database.db';

// ouvrir la base de données
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});

// vérifier si la table "products" existe déjà
db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='products'", (err, rows) => {
  if (err) {
    console.error(err.message);
  } else {
    if (rows.length === 0) {
      // créer la table "products" avec des colonnes "name", "category", "price" et "stocked"
      db.run('CREATE TABLE products (name TEXT, category TEXT, price TEXT, stocked INTEGER)', (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Table "products" created.');

          // préparer une commande SQL pour insérer les données dans la table
          const stmt = db.prepare('INSERT INTO products VALUES (?, ?, ?, ?)');
          // parcourir les objets dans le tableau "products" et insérer leurs propriétés dans la table
          PRODUCTS.products.forEach((product) => {
            // la commande run exécute la commande SQL préparée avec les valeurs correspondantes
            stmt.run(product.name, product.category, product.price, product.stocked ? 1 : 0);
          });
          // finaliser la commande préparée
          stmt.finalize();
          console.log('Data inserted into table "products".');
        }
      });
    } else {
      console.log('Table "products" already exists.');
    }
  }
});

// fermer la base de données
db.close((err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Closed the database connection.');
  }
});