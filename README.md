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

## Testing

```bash
# Run all tests
npm test

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.