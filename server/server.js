const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(bodyParser.json());

// db connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'detailsinfo',
  connectionLimit: 10,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.post('/api/signup', (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const checkEmailQuery = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
  const checkEmailValues = [email];

  db.query(checkEmailQuery, checkEmailValues, (err, result) => {
    if (err) {
      console.error('Checking error for existing email', err);
      res.status(500).json({ message: 'Signup failed' });
    } else {
      const emailCount = result[0].count;

      if (emailCount > 0) {
        console.log('User with this email already exists');
        res.status(500).json({ message: 'User with this email already exists' });
      } else {
        const insertQuery = 'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)';
        const insertValues = [firstName, lastName, email, password];

        db.query(insertQuery, insertValues, (err, result) => {
          if (err) {
            console.error('Signup failed:', err);
            res.status(500).json({ message: 'Signup failed' });
          } else {
            console.log('User signed up successfully');
            res.status(200).json({ message: 'Signup successfully' });
          }
        });
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





























