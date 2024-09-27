const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const PORT = process.env.PORT || 3306;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'facility',
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
  } else {
    console.log('Connected to the database');
  }
});

app.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.url}`);
  next();
});
// CRUD Endpoints
// Retrieve all items
app.get('/items', (req, res) => {
  connection.query('SELECT * FROM items', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});
// Retrieve a single item
app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM items WHERE id = ?', [id], (error, results) => {
    if (error) throw error;
    res.json(results[0]);
  });
});
// Create a new item
app.post('/items', (req, res) => {
  const { name, description } = req.body;
  connection.query('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], (error,
    results) => {
    if (error) throw error;
    res.json({ id: results.insertId, name, description });
  });
});
// Update an item
app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  connection.query('UPDATE items SET name = ?, description = ? WHERE id = ?', [name, description,
    id], (error) => {
      if (error) throw error;
      res.json({ id, name, description });
    });
});
// Delete an item
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM items WHERE id = ?', [id], (error) => {
    if (error) throw error;
    res.json({ id });
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});