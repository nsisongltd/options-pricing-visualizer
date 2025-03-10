import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { calculateOptionPrice } from '../utils/wasmLoader';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ResultBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));

function OptionsCalculator() {
  const [formData, setFormData] = useState({
    spotPrice: '',
    strikePrice: '',
    timeToExpiry: '',
    volatility: '',
    riskFreeRate: '',
    optionType: 'call',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCalculate = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate inputs
      const values = Object.values(formData);
      if (values.some((value) => value === '')) {
        throw new Error('Please fill in all fields');
      }

      // Convert string values to numbers
      const params = {
        spotPrice: parseFloat(formData.spotPrice),
        strikePrice: parseFloat(formData.strikePrice),
        timeToExpiry: parseFloat(formData.timeToExpiry),
        volatility: parseFloat(formData.volatility),
        riskFreeRate: parseFloat(formData.riskFreeRate),
        optionType: formData.optionType,
      };

      // Calculate option price using WebAssembly
      const calculatedPrice = await calculateOptionPrice(params);

      // Save calculation to backend
      await axios.post('http://localhost:5000/api/calculations', {
        ...params,
        calculated_price: calculatedPrice,
      });

      setResult(calculatedPrice);
    } catch (err) {
      setError(err.message || 'An error occurred during calculation');
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Options Pricing Calculator
      </Typography>
      <StyledPaper>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Spot Price"
              name="spotPrice"
              type="number"
              value={formData.spotPrice}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Strike Price"
              name="strikePrice"
              type="number"
              value={formData.strikePrice}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Time to Expiry (years)"
              name="timeToExpiry"
              type="number"
              value={formData.timeToExpiry}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Volatility"
              name="volatility"
              type="number"
              value={formData.volatility}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Risk-Free Rate"
              name="riskFreeRate"
              type="number"
              value={formData.riskFreeRate}
              onChange={handleChange}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Option Type</InputLabel>
              <Select
                name="optionType"
                value={formData.optionType}
                onChange={handleChange}
                label="Option Type"
                disabled={loading}
              >
                <MenuItem value="call">Call</MenuItem>
                <MenuItem value="put">Put</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCalculate}
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Calculate'}
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {result !== null && (
        <ResultBox>
          <Typography variant="h6" gutterBottom>
            Result
          </Typography>
          <Typography variant="h4" color="primary">
            ${result.toFixed(4)}
          </Typography>
        </ResultBox>
      )}
    </Box>
  );
}

export default OptionsCalculator; 