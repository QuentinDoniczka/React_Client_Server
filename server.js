require('./install.js')

const express = require('express');
require('dotenv').config();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.static('client/build'));

const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.');
  }
});

function getProducts(callback) {
  const sql = 'SELECT * FROM products';
  db.all(sql, [], (err, rows) => {
    if (err) {
      callback(err);
    } else {
      callback(null, rows);
    }
  });
}

app.get('/api/products', (req, res) => {
  getProducts((err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    } else {
      res.json(rows);
    }
  });
});

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`le serveur est lancé sur le port : ${PORT}`)
});


// Fonction pour ajouter un produit dans la base de données
function addProduct(product, callback) {
  const sql = 'INSERT INTO products (category, name, price, stocked) VALUES (?, ?, ?, ?)';
  const params = [product.category, product.name, product.price, product.stocked ? 1 : 0];
  db.run(sql, params, function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, { id: this.lastID, ...product });
    }
  });
}


// Route POST pour ajouter un produit
app.post('/api/products', (req, res) => {
  const product = req.body;
  addProduct(product, (err, newProduct) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    } else {
      res.status(201).json(newProduct);
    }
  });
});

