# Options Pricing Visualizer

A modern web application for visualizing options pricing using WebAssembly for fast calculations.

## Features

- Real-time options pricing calculations using WebAssembly
- Interactive visualizations with D3.js
- Modern React frontend with Material-UI
- Express.js backend with SQLite database
- Black-Scholes model implementation in WebAssembly

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/options-pricing-visualizer.git
cd options-pricing-visualizer
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

## Development

1. Start the development servers:
```bash
# From the root directory
npm start
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
options-pricing-visualizer/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── wasm/         # WebAssembly modules
│   │   ├── utils/        # Utility functions
│   │   └── App.js        # Main App component
├── backend/           # Express.js backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── models/       # Data models
│   │   └── server.js     # Main server file
├── database/         # SQLite database files
└── tests/           # Test files
```

## Building for Production

```bash
# From the root directory
npm run build
```

## For All Testing

```bash
# Run all tests
npm test

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend
```

## If you want to contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.


# working it out
Start the development servers:
The application will be available at:
Frontend: http://localhost:3000
Backend: http://localhost:5000


# So far, what i have done:

WASM implementation for fast options pricing calculations
Interactive visualization of option prices vs strike prices
Greeks visualization (Delta, Gamma, Theta, Vega)
Backend API with SQLite database
Frontend API service for data fetching
Added a historical data visualization component that shows option prices over time
Added a sample data generation and database seeding
Made smooth integration with the existing visualization components

# Considering doing this next:
Add historical data visualization
Implement user authentication
Add more advanced features like:
Option chains
Implied volatility surface
Portfolio analysis
Risk metrics

# okay, rants

- I tried to setup the app components to include the auth and protected routes in app.jsx
- i also made sure the navbar.js component now has the logout functionality, before i forget t
- the problem has been with npm, the package.json file shii, so i finally found a way now, i will just add the new dependencies.
