const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Database setup
const db = new sqlite3.Database(path.join(__dirname, '../../database/options.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to SQLite database');
  initializeDatabase();
});

// Initialize database tables
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS calculations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      spot_price REAL NOT NULL,
      strike_price REAL NOT NULL,
      time_to_expiry REAL NOT NULL,
      volatility REAL NOT NULL,
      risk_free_rate REAL NOT NULL,
      option_type TEXT NOT NULL,
      calculated_price REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Routes
app.post('/api/calculations', (req, res) => {
  const {
    spot_price,
    strike_price,
    time_to_expiry,
    volatility,
    risk_free_rate,
    option_type,
    calculated_price,
  } = req.body;

  const sql = `
    INSERT INTO calculations (
      spot_price,
      strike_price,
      time_to_expiry,
      volatility,
      risk_free_rate,
      option_type,
      calculated_price
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      spot_price,
      strike_price,
      time_to_expiry,
      volatility,
      risk_free_rate,
      option_type,
      calculated_price,
    ],
    function (err) {
      if (err) {
        console.error('Error saving calculation:', err);
        res.status(500).json({ error: 'Failed to save calculation' });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        message: 'Calculation saved successfully',
      });
    }
  );
});

app.get('/api/calculations', (req, res) => {
  const sql = 'SELECT * FROM calculations ORDER BY created_at DESC LIMIT 10';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching calculations:', err);
      res.status(500).json({ error: 'Failed to fetch calculations' });
      return;
    }
    res.json(rows);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 