import React, { useState } from 'react';
import { Container, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Visualization from './components/Visualization';
import GreeksVisualization from './components/GreeksVisualization';
import HistoricalDataVisualization from './components/HistoricalDataVisualization';
import Navbar from './components/Navbar';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

function App() {
  const [params, setParams] = useState({
    spotPrice: 100,
    strikePrice: 100,
    timeToExpiry: 1,
    volatility: 0.2,
    riskFreeRate: 0.05,
    optionType: 'call'
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Visualization params={params} onParamsChange={setParams} />
          <GreeksVisualization params={params} />
          <HistoricalDataVisualization params={params} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
