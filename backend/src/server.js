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
  db.serialize(() => {
    // Historical options data table
    db.run(`CREATE TABLE IF NOT EXISTS historical_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL,
      strike_price REAL NOT NULL,
      expiration_date TEXT NOT NULL,
      option_type TEXT NOT NULL,
      price REAL NOT NULL,
      volume INTEGER,
      timestamp TEXT NOT NULL
    )`);

    // User preferences table
    db.run(`CREATE TABLE IF NOT EXISTS user_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      default_spot_price REAL,
      default_strike_price REAL,
      default_time_to_expiry REAL,
      default_volatility REAL,
      default_risk_free_rate REAL,
      default_option_type TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`);
  });
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

app.get('/api/historical-data', (req, res) => {
  const { symbol, startDate, endDate } = req.query;
  const query = `
    SELECT * FROM historical_data 
    WHERE symbol = ? 
    AND timestamp BETWEEN ? AND ?
    ORDER BY timestamp DESC
  `;
  
  db.all(query, [symbol, startDate, endDate], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/user-preferences/:userId', (req, res) => {
  const { userId } = req.params;
  const query = 'SELECT * FROM user_preferences WHERE user_id = ?';
  
  db.get(query, [userId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row || {});
  });
});

app.post('/api/user-preferences/:userId', (req, res) => {
  const { userId } = req.params;
  const preferences = req.body;
  const now = new Date().toISOString();
  
  const query = `
    INSERT OR REPLACE INTO user_preferences 
    (user_id, default_spot_price, default_strike_price, default_time_to_expiry, 
     default_volatility, default_risk_free_rate, default_option_type, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.run(
    query,
    [
      userId,
      preferences.spotPrice,
      preferences.strikePrice,
      preferences.timeToExpiry,
      preferences.volatility,
      preferences.riskFreeRate,
      preferences.optionType,
      now,
      now
    ],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
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