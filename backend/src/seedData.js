const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../../database/options.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
    return;
  }
  console.log('Connected to SQLite database');
  seedData();
});

function generateSampleData() {
  const data = [];
  const symbols = ['AAPL', 'GOOGL', 'MSFT'];
  const now = new Date();
  
  for (const symbol of symbols) {
    // Generate 30 days of data
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate 5 different strike prices for each day
      for (let j = 0; j < 5; j++) {
        const strikePrice = 100 + (j * 5); // Strikes at 100, 105, 110, 115, 120
        
        // Generate both call and put data
        for (const optionType of ['call', 'put']) {
          // Generate random price between 1 and 20
          const price = 1 + Math.random() * 19;
          // Generate random volume between 100 and 1000
          const volume = Math.floor(100 + Math.random() * 900);
          
          data.push({
            symbol,
            strike_price: strikePrice,
            expiration_date: new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from data point
            option_type: optionType,
            price,
            volume,
            timestamp: date.toISOString()
          });
        }
      }
    }
  }
  
  return data;
}

function seedData() {
  const data = generateSampleData();
  const query = `
    INSERT INTO historical_data 
    (symbol, strike_price, expiration_date, option_type, price, volume, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  let inserted = 0;
  let errors = 0;
  
  data.forEach(item => {
    db.run(
      query,
      [
        item.symbol,
        item.strike_price,
        item.expiration_date,
        item.option_type,
        item.price,
        item.volume,
        item.timestamp
      ],
      function(err) {
        if (err) {
          console.error('Error inserting data:', err);
          errors++;
        } else {
          inserted++;
        }
        
        // Log progress every 100 records
        if ((inserted + errors) % 100 === 0) {
          console.log(`Progress: ${inserted} records inserted, ${errors} errors`);
        }
        
        // When all records are processed
        if (inserted + errors === data.length) {
          console.log(`Seeding complete. ${inserted} records inserted, ${errors} errors`);
          db.close();
        }
      }
    );
  });
} 