import React, { useState } from 'react';
import { Container, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Visualization from './components/Visualization';
import GreeksVisualization from './components/GreeksVisualization';
import HistoricalDataVisualization from './components/HistoricalDataVisualization';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import LoadingSpinner from './components/LoadingSpinner';
import { AuthProvider, useAuth } from './contexts/AuthContext';

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

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <Login onToggleForm={() => setIsLogin(false)} />
  ) : (
    <Register onToggleForm={() => setIsLogin(true)} />
  );
}

function Dashboard() {
  const [params, setParams] = useState({
    spotPrice: 100,
    strikePrice: 100,
    timeToExpiry: 1,
    volatility: 0.2,
    riskFreeRate: 0.05,
    optionType: 'call'
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
      <Visualization params={params} onParamsChange={setParams} />
      <GreeksVisualization params={params} />
      <HistoricalDataVisualization params={params} />
    </Container>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Routes>
              <Route path="/login" element={<AuthPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <Dashboard />
                    </>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
