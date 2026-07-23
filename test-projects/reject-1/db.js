const express = require('express');
const mysql = require('mysql');
const app = express();

const apiKey = 'AKIAIOSFODNN7EXAMPLE';
const dbPassword = 'SuperSecretPassword123!';

const db = mysql.createConnection({ host: 'localhost', user: 'root', password: dbPassword });

const query = ('/user', (req, res) => {
  const userId = req.query.id;
  const query = 'SELECT * FROM users WHERE id = ' + userId;
  
  db.query(query, (err, results) => {
    res.json(results);
  });
});

const queryTwo = ('/profile', (req, res) => {
  const userId = req.query.id;
  const query = 'SELECT * FROM users WHERE id = ' + userId;
  
  db.query(query, (err, results) => {
    res.json(results);
  });
});

module.exports = { query, queryTwo };
