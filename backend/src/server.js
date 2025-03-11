const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

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
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`);

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
      user_id INTEGER NOT NULL,
      default_spot_price REAL,
      default_strike_price REAL,
      default_time_to_expiry REAL,
      default_volatility REAL,
      default_risk_free_rate REAL,
      default_option_type TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // User calculations table
    db.run(`CREATE TABLE IF NOT EXISTS user_calculations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      spot_price REAL NOT NULL,
      strike_price REAL NOT NULL,
      time_to_expiry REAL NOT NULL,
      volatility REAL NOT NULL,
      risk_free_rate REAL NOT NULL,
      option_type TEXT NOT NULL,
      calculated_price REAL NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);
  });
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    db.run(
      'INSERT INTO users (email, password, name, created_at) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, now],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Error creating user' });
        }
        res.status(201).json({ id: this.lastID, message: 'User created successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging in' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    try {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
      res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      res.status(500).json({ error: 'Error logging in' });
    }
  });
});

// Protected routes
app.get('/api/user/preferences', authenticateToken, (req, res) => {
  const query = 'SELECT * FROM user_preferences WHERE user_id = ?';
  
  db.get(query, [req.user.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row || {});
  });
});

app.post('/api/user/preferences', authenticateToken, (req, res) => {
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
      req.user.id,
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

app.post('/api/calculations', authenticateToken, (req, res) => {
  const {
    spot_price,
    strike_price,
    time_to_expiry,
    volatility,
    risk_free_rate,
    option_type,
    calculated_price,
  } = req.body;

  const now = new Date().toISOString();
  const sql = `
    INSERT INTO user_calculations (
      user_id,
      spot_price,
      strike_price,
      time_to_expiry,
      volatility,
      risk_free_rate,
      option_type,
      calculated_price,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      req.user.id,
      spot_price,
      strike_price,
      time_to_expiry,
      volatility,
      risk_free_rate,
      option_type,
      calculated_price,
      now,
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

app.get('/api/calculations', authenticateToken, (req, res) => {
  const sql = 'SELECT * FROM user_calculations WHERE user_id = ? ORDER BY created_at DESC LIMIT 10';
  db.all(sql, [req.user.id], (err, rows) => {
    if (err) {
      console.error('Error fetching calculations:', err);
      res.status(500).json({ error: 'Failed to fetch calculations' });
      return;
    }
    res.json(rows);
  });
});

// Sample data generation
function generateSampleData(symbol, startDate, endDate) {
  const data = [];
  const daysBetween = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const basePrice = Math.random() * 100 + 50; // Random base price between 50 and 150

  for (let i = 0; i < daysBetween; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Generate realistic price movement
    const dailyVolatility = 0.02; // 2% daily volatility
    const priceChange = basePrice * dailyVolatility * (Math.random() * 2 - 1);
    const price = basePrice + priceChange;

    data.push({
      symbol,
      strike_price: basePrice,
      expiration_date: new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days expiry
      option_type: 'call',
      price: Math.max(0, price),
      volume: Math.floor(Math.random() * 1000) + 100,
      timestamp: date.toISOString()
    });
  }
  return data;
}

// Historical data endpoints
app.get('/api/historical-data', authenticateToken, async (req, res) => {
  const { symbol, startDate, endDate } = req.query;

  try {
    // First, try to get real market data
    let marketData = [];
    try {
      marketData = await fetchMarketData(symbol, startDate, endDate);
    } catch (error) {
      console.log('Falling back to sample data:', error.message);
    }

    // If no market data, use sample data
    if (!marketData || marketData.length === 0) {
      marketData = generateSampleData(symbol, startDate, endDate);
    }

    // Store the data in the database
    const insertPromises = marketData.map(data => {
      return new Promise((resolve, reject) => {
        db.run(
          `INSERT OR REPLACE INTO historical_data 
           (symbol, strike_price, expiration_date, option_type, price, volume, timestamp)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [data.symbol, data.strike_price, data.expiration_date, data.option_type, 
           data.price, data.volume, data.timestamp],
          function(err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    });

    await Promise.all(insertPromises);

    // Return the data
    res.json(marketData);
  } catch (error) {
    console.error('Error handling historical data:', error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// Yahoo Finance API integration
async function fetchMarketData(symbol, startDate, endDate) {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${Math.floor(new Date(startDate).getTime() / 1000)}&period2=${Math.floor(new Date(endDate).getTime() / 1000)}&interval=1d`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch market data');
    }

    const data = await response.json();
    const timestamps = data.chart.result[0].timestamp;
    const quotes = data.chart.result[0].indicators.quote[0];
    
    return timestamps.map((timestamp, i) => ({
      symbol,
      strike_price: quotes.close[i],
      expiration_date: new Date(timestamp * 1000 + 30 * 24 * 60 * 60 * 1000).toISOString(),
      option_type: 'call',
      price: quotes.close[i],
      volume: quotes.volume[i],
      timestamp: new Date(timestamp * 1000).toISOString()
    }));
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 